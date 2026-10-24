"""Tag each stylesheet and script link with a short hash of the file's contents (?v=...), so a newly
published page never pairs with an old copy the browser cached. Run before publishing."""
import hashlib, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'colophon.html', '404.html']
LINK = re.compile(r'''((?:href|src)=")(/?)([\w./-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")''')

def stamp(match):
    pre, slash, path, end = match.groups()
    file = ROOT / path
    if not file.exists():
        return match.group(0)
    digest = hashlib.sha256(file.read_bytes()).hexdigest()[:8]
    return f'{pre}{slash}{path}?v={digest}{end}'

for name in PAGES:
    page = ROOT / name
    text = page.read_text(encoding='utf-8')
    new = LINK.sub(stamp, text)
    if new != text:
        page.write_text(new, encoding='utf-8')
        print('stamped', name)
