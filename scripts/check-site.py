"""Check local references and explicit byte budgets; no browser/a11y audit implied."""
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / 'site-check.json'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.duplicates = path, set(), [], []
        self.videos, self.stories = [], []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'video':
            self.videos.append(attrs)
        if 'data-story' in attrs:
            self.stories.append(attrs['data-story'])
        for attr in ('href', 'src', 'poster'):
            if attrs.get(attr):
                self.refs.append(attrs[attr])


def main():
    # Scope the redesigned entry points; retained legacy pages are not migrated here.
    pages = {p.resolve(): Page(p) for p in (ROOT / 'index.html', ROOT / 'colophon.html')}
    errors, count = [], 0
    references = []
    for path, page in pages.items():
        errors.extend(f'{path.name}: duplicate ID {i}' for i in page.duplicates)
        for target in page.stories:
            if target not in page.ids:
                errors.append(f'{path.name}: missing story {target}')
        for video in page.videos:
            if any(attr not in video for attr in ('controls', 'playsinline', 'poster', 'aria-label')):
                errors.append(f'{path.name}: video needs controls, inline playback, a poster and an accessible label')
            if 'autoplay' in video or video.get('preload') != 'none':
                errors.append(f'{path.name}: video must play on request with preload=none')
        references.extend((path, ref) for ref in page.refs)
    for path in (ROOT / 'home.css', ROOT / 'gallery.css'):
        references.extend((path, match[1].strip()) for match in re.findall(
            r'url\(\s*([\'"]?)(.*?)\1\s*\)', path.read_text(encoding='utf-8')))
    for origin, ref in references:
        parsed = urlsplit(ref)
        if parsed.scheme or parsed.netloc:
            continue
        count += 1
        target = (origin.parent / unquote(parsed.path)).resolve() if parsed.path else origin.resolve()
        if not target.is_relative_to(ROOT):
            errors.append(f'{origin.name}: reference outside site: {ref}')
        elif not target.is_file() and target != REPORT:
            errors.append(f'{origin.name}: missing file: {ref}')
        elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
            errors.append(f'{origin.name}: missing fragment: {ref}')
    budgets = [
        ('homepage_js', ['home.js'], 10 * 1024),
        ('stylesheets', ['home.css', 'gallery.css'], 40 * 1024),
        ('foliage_backdrop', ['assets/jacaranda-bougainvillea.webp'], 100 * 1024),
        ('branch_accent', ['assets/bougainvillea-branch-v1.webp'], 100 * 1024),
        ('featured_illustration', ['assets/hotpot.webp'], 150 * 1024),
        ('selected_videos', [str(p.relative_to(ROOT)).replace('\\', '/') for p in sorted((ROOT / 'assets/media').glob('*.mp4'))], 5 * 1024 * 1024),
    ]
    sizes = {}
    for media in (ROOT / 'assets/media').glob('*.mp4'):
        if media.stat().st_size > 2 * 1024 * 1024:
            errors.append(f'{media.name}: clip exceeds 2 MiB')
    for name, files, limit in budgets:
        size = sum((ROOT / f).stat().st_size for f in files)
        sizes[name] = {'files': files, 'bytes': size, 'budget_bytes': limit}
        if size > limit:
            errors.append(f'{name}: {size} bytes exceeds {limit}')
    if errors:
        raise SystemExit('\n'.join(errors))
    result = {
        'generated_at_utc': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'scope': 'Homepage, colophon, and their stylesheets. Manual source check, not live deployment telemetry.',
        'result': 'pass', 'local_references_checked': count, 'file_sizes': sizes,
        'play_on_request_videos': sum(len(page.videos) for page in pages.values()),
        'not_checked': ['external URLs', 'browser layout', 'keyboard interactions',
                        'screen readers', 'Lighthouse', 'automated accessibility audit'],
    }
    REPORT.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
