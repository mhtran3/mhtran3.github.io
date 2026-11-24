"""Build the leaf-light masks (assets/fleck-a/b/c.webp) from the original light shapes in
scripts/light/source/.

What it does, in order:
  1. Replaces the plain, identical ovals with varied sun spots: different sizes and brightness,
     irregular gap shapes rounded by the sun's disk, some cut by a leaf edge, some in pairs.
  2. Takes leaf-shaped bites out of the big patches so their outlines stop reading as rows of
     identical round bumps.
  3. Gives every mask a smooth depth map (near, middle, far leaves) and softens edges by depth:
     near light stays crisp, far light is softest. Brightness is kept; only edges change.
  4. Fades light away from mask borders the original never touched, so the page never clips
     softened light in a straight line.

The random choices use fixed seeds, so running it again gives the same images. The page code
(position, sway, and the shift of the light on the papers) is untouched by this script.

Run from the repository root:  python scripts/light/build-light.py [--preview DIR]
Needs Python with Pillow, NumPy, SciPy and scikit-image. --preview also writes depth maps and
the varied shapes before softening, for checking changes.
"""
import argparse
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts' / 'light' / 'source'
OUT = ROOT / 'assets'

SIG = {'near': 1.2, 'mid': 4.0, 'far': 9.0}           # blur in mask pixels
STRETCH = {'near': (0.04, 0.80), 'mid': (0.04, 0.84), 'far': (0.03, 0.90)}

def stretch(x, lo, hi): return np.clip((x - lo) / (hi - lo), 0, 1)

def depth_map(a, seed):
    h, w = a.shape
    rng = np.random.default_rng(seed)
    n = ndi.gaussian_filter(rng.standard_normal((h, w)), 0.16 * min(h, w))
    n = (n.argsort(axis=None).argsort().reshape(h, w)) / (h * w - 1)   # equal thirds
    b = a > 0.18
    lab, k = ndi.label(b)
    diam = np.sqrt(4 * ndi.sum(b, lab, range(1, k + 1)) / np.pi)
    size = np.zeros(k + 1); size[1:] = np.clip((diam - 10) / 50, 0, 1)
    # carry each patch's size out to the nearby pixels so blurred edges inherit it
    idx = ndi.distance_transform_edt(~b, return_distances=False, return_indices=True)
    s = size[lab[idx[0], idx[1]]]
    s = ndi.gaussian_filter(s, SIG['far'] * 1.5)
    d = 0.6 * n + 0.4 * (1 - s)            # small round sun spots lean far
    # spread depths evenly over the lit area so each of the three layers gets about a third
    lit = np.sort(d[a > 0.18])
    return np.searchsorted(lit, d) / max(len(lit) - 1, 1)

def ellipse_mask(h, w, cy, cx, ry, rx, theta):
    y, x = np.mgrid[0:h, 0:w]
    y = y - cy; x = x - cx
    c, s_ = np.cos(theta), np.sin(theta)
    u = (x * c + y * s_) / max(rx, 1e-6); v = (-x * s_ + y * c) / max(ry, 1e-6)
    return (u * u + v * v) <= 1

def sun_spot(rng, D, theta, ss=4):
    # One sunfleck: a gap in the leaves, rounded by the sun's disk, sometimes partly
    # blocked by a leaf edge. Drawn 4x larger and averaged down for smooth edges.
    k = float(np.clip(rng.lognormal(0, 0.25), 0.65, 1.35))
    size = D * k * ss
    aspect = rng.uniform(0.55, 0.9)
    kind = rng.choice(['pinhole', 'gap', 'gap', 'bitten'], p=[0.35, 0.2, 0.2, 0.25])
    R = int(size * 1.4) + 6
    h = w = 2 * R
    sun_rx = size * (0.5 if kind == 'pinhole' else rng.uniform(0.34, 0.46))
    sun = ellipse_mask(int(sun_rx * 2) + 3, int(sun_rx * 2) + 3, sun_rx + 1, sun_rx + 1, sun_rx * aspect, sun_rx, theta)
    gap = np.zeros((h, w), bool)
    if kind == 'pinhole':
        gap[R, R] = True
    else:
        n = rng.integers(4, 8)
        ang = np.sort(rng.uniform(0, 2 * np.pi, n))
        rad = size * rng.uniform(0.18, 0.34, n)
        from skimage.draw import polygon
        rr, cc = polygon(R + rad * np.sin(ang), R + rad * np.cos(ang), (h, w))
        gap[rr, cc] = True
        if not gap.any(): gap[R, R] = True
    from scipy.signal import fftconvolve
    m = fftconvolve(gap.astype(float), sun.astype(float), mode='same') > 0.5
    if kind == 'bitten' or (kind == 'gap' and rng.random() < 0.3):
        # a leaf edge crossing the spot: a long, thin ellipse cutting into one side
        ang = rng.uniform(0, 2 * np.pi); off = size * rng.uniform(0.35, 0.6)
        leaf = ellipse_mask(h, w, R + off * np.sin(ang), R + off * np.cos(ang), size * rng.uniform(0.18, 0.3), size * rng.uniform(0.6, 1.0), ang + np.pi / 2 + rng.uniform(-0.5, 0.5))
        m &= ~leaf
    # average the supersampled patch down to mask pixels
    hh, ww = (h // ss) * ss, (w // ss) * ss
    out = m[:hh, :ww].reshape(hh // ss, ss, ww // ss, ss).mean(axis=(1, 3))
    return out

def vary_spots(a, seed):
    # Replace the isolated, uniform ovals with varied sunflecks at the same places.
    from skimage.measure import regionprops, label
    rng = np.random.default_rng(seed)
    lab = label(a > 0.18)
    def plain_and_open(p):
        # only plain, evenly lit ovals sitting in open shade; leave tiny specks between
        # leaflets and the two-tone overlapping spots as they are
        if not (9 <= p.equivalent_diameter_area <= 60 and p.solidity > 0.88): return False
        own = lab == p.label
        core = ndi.binary_erosion(own, iterations=2)
        vals = a[core] if core.any() else a[own]
        if vals.std() / max(vals.mean(), 1e-6) > 0.3: return False
        ring = ndi.binary_dilation(own, iterations=6) & ~ndi.binary_dilation(own, iterations=2)
        return a[ring].mean() < 0.15
    props = [p for p in regionprops(lab, intensity_image=a) if plain_and_open(p)]
    if not props: return a
    dom = np.median([p.orientation for p in props])
    out = a.copy()
    gone = np.isin(lab, [p.label for p in props])
    out[ndi.binary_dilation(gone, iterations=2)] = 0
    h, w = a.shape
    for p in props:
        D = p.equivalent_diameter_area
        spots = [(0.0, 0.0, 1.0)]
        if rng.random() < 0.25:                       # a smaller neighbour now and then
            ang = rng.uniform(0, 2 * np.pi); dist = D * rng.uniform(0.6, 1.1)
            spots.append((dist * np.sin(ang), dist * np.cos(ang), rng.uniform(0.35, 0.6)))
        for dy, dx, scale in spots:
            spot = sun_spot(rng, D * scale, -(dom + rng.uniform(-0.45, 0.45)) + np.pi / 2)
            spot *= min(1.0, p.intensity_mean * rng.uniform(0.75, 1.05))
            cy, cx = p.centroid
            cy += dy + rng.uniform(-0.15, 0.15) * D; cx += dx + rng.uniform(-0.15, 0.15) * D
            sh, sw = spot.shape
            y0, x0 = int(round(cy - sh / 2)), int(round(cx - sw / 2))
            ys, xs = max(0, y0), max(0, x0); ye, xe = min(h, y0 + sh), min(w, x0 + sw)
            if ye <= ys or xe <= xs: continue
            out[ys:ye, xs:xe] = np.maximum(out[ys:ye, xs:xe], spot[ys - y0:ye - y0, xs - x0:xe - x0])
    print('  replaced', len(props), 'ovals')
    return out

def notch_patches(a, seed):
    # Leaves catching part of the light: thin leaf-shaped notches along the outlines of
    # the big patches, so their edges stop reading as a row of identical round bumps.
    from skimage.measure import regionprops, label, find_contours
    rng = np.random.default_rng(seed + 200)
    lab = label(a > 0.5)
    out = a.copy(); h, w = a.shape
    count = 0
    for p in regionprops(lab):
        if p.equivalent_diameter_area < 60: continue
        own = np.pad(lab[p.slice] == p.label, 1)
        sm = ndi.gaussian_filter(own.astype(float), 3)
        gy, gx = np.gradient(sm)
        for c in find_contours(own.astype(float), 0.5):
            step = 95
            for i in range(int(rng.uniform(0, step)), len(c), step):
                if rng.random() > 0.4: continue
                cy, cx = c[i]
                ny, nx = -gy[int(cy), int(cx)], -gx[int(cy), int(cx)]          # outward
                nn = np.hypot(ny, nx)
                if nn < 1e-6: continue
                ny, nx = ny / nn, nx / nn
                L, W = rng.uniform(11, 22), rng.uniform(5.5, 10)
                # leaf crosses the edge at an angle; centred a little outside so it bites
                ang = np.arctan2(ny, nx) + np.pi / 2 + rng.uniform(-0.7, 0.7)
                y = cy - 1 + p.slice[0].start + ny * W * 0.45
                x = cx - 1 + p.slice[1].start + nx * W * 0.45
                y0, y1 = int(max(0, y - L - 2)), int(min(h, y + L + 3)); x0, x1 = int(max(0, x - L - 2)), int(min(w, x + L + 3))
                if y1 <= y0 or x1 <= x0: continue
                yy, xx = np.mgrid[y0:y1, x0:x1]
                u = ((xx - x) * np.cos(ang) + (yy - y) * np.sin(ang)) / L
                v = (-(xx - x) * np.sin(ang) + (yy - y) * np.cos(ang)) / (W * (1 - 0.35 * u * u))   # leaf: wider in the middle
                r = u * u + v * v
                leaf = np.clip((1.1 - r) / 0.25, 0, 1)
                out[y0:y1, x0:x1] *= 1 - leaf
                count += 1
    print('  notched', count, 'places')
    return out

def roughen(a, d, seed, amp=3.0):
    # Nudge outlines with a smooth random warp so the big patches lose their row of
    # identical round bumps. Near leaves move least, so their shapes stay intact.
    rng = np.random.default_rng(seed + 100)
    h, w = a.shape
    fy = ndi.gaussian_filter(rng.standard_normal((h, w)), 10); fx = ndi.gaussian_filter(rng.standard_normal((h, w)), 10)
    fy /= fy.std(); fx /= fx.std()
    A = amp * (0.45 + 0.55 * d)
    y, x = np.mgrid[0:h, 0:w].astype(float)
    return ndi.map_coordinates(a, [y + fy * A, x + fx * A], order=1, mode='nearest')

def layered(a, d):
    lv = {}
    for k, sg in SIG.items():
        bl = ndi.gaussian_filter(a, sg)
        lv[k] = stretch(bl, *STRETCH[k])
    wn = np.clip((0.5 - d) / (1 / 3), 0, 1)      # fully near below 1/6, gone by 1/2
    wf = np.clip((d - 0.5) / (1 / 3), 0, 1)      # starts at 1/2, fully far above 5/6
    wm = 1 - wn - wf
    return wn * lv['near'] + wm * lv['mid'] + wf * lv['far'], (wn, wm, wf)

def fade_unlit_borders(res, a, margin=int(3 * SIG['far'])):
    # Where the original light never touched a border, softened light must not either:
    # the page clips each mask at its rectangle, which would show as a straight edge.
    h, w = res.shape
    def ramp(n):
        t = np.clip(np.arange(n) / margin, 0, 1)
        return t * t * (3 - 2 * t)
    out = res.copy()
    if a[0].max() < 0.03:     out *= ramp(h)[:, None]
    if a[-1].max() < 0.03:    out *= ramp(h)[::-1][:, None]
    if a[:, 0].max() < 0.03:  out *= ramp(w)[None, :]
    if a[:, -1].max() < 0.03: out *= ramp(w)[::-1][None, :]
    return out

def build(name, i, preview=None):
    im = Image.open(SOURCE / f'{name}.webp').convert('RGBA')
    a0 = np.array(im)[..., 3] / 255
    a = vary_spots(a0, seed=21 + i)
    a = notch_patches(a, seed=i)
    d = depth_map(a, seed=7 + i)
    a = roughen(a, d, seed=i)
    res, (wn, wm, wf) = layered(a, d)
    res = fade_unlit_borders(res, a0)
    o = im.copy(); o.putalpha(Image.fromarray((res * 255).round().astype('uint8')))
    o.save(OUT / f'{name}.webp', 'WEBP', quality=90, method=6)
    if preview:
        Image.fromarray((a * 255).astype('uint8')).save(preview / f'{name}-shapes.png')
        # light coloured by depth: near white, middle gold, far blue
        col = (wn[..., None] * np.array([255, 255, 255]) + wm[..., None] * np.array([240, 180, 60]) + wf[..., None] * np.array([90, 150, 255]))
        vis = (col * res[..., None] + np.array([30, 26, 22]) * (1 - res[..., None])).astype('uint8')
        Image.fromarray(vis).save(preview / f'{name}-depth.png')
    print(name, 'mean light before %.3f after %.3f | share near/mid/far: %.2f %.2f %.2f' % (
        a0.mean(), res.mean(), *(float((w * a).sum() / a.sum()) for w in (wn, wm, wf))))

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--preview', type=Path, help='folder for depth maps and unsoftened shapes')
    args = ap.parse_args()
    if args.preview: args.preview.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(('fleck-a', 'fleck-b', 'fleck-c')):
        build(name, i, args.preview)
