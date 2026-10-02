"""Archive official SG PDFs. Run once; existing files are reused and checksummed."""
import concurrent.futures
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "data/sources"
BASE = "https://www.ipa.go.jp"
PAGES = [f"{BASE}/shiken/mondai-kaiotu/{y}h{y-1988:02}.html" for y in range(2016, 2020)]
PAGES += [f"{BASE}/shiken/mondai-kaiotu/sg_fe/koukai/{y}r{y-2018:02}.html" for y in range(2023, 2027)]
PAGES += [f"{BASE}/shiken/syllabus/henkou/2022/20221226.html", f"{BASE}/shiken/syllabus/henkou/2022/20220425.html"]

def read(url):
    request = Request(url, headers={"User-Agent": "SG-Exam-Prep/0.1 (personal educational archive)"})
    with urlopen(request, timeout=60) as response:
        return response.read()

def archive(item):
    url, page = item
    name = Path(urlparse(url).path).name
    path = DEST / name
    if not path.exists():
        data = read(url)
        if not data.startswith(b"%PDF"):
            raise ValueError(f"Not a PDF: {url}")
        path.write_bytes(data)
    data = path.read_bytes()
    return {"file": name, "url": url, "sourcePage": page, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "copyright": "IPA", "downloadedOn": "2026-10-02"}

if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    sources = {}
    for page in PAGES:
        html = read(page).decode("utf-8")
        links = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html, flags=re.I)
        sg = [urljoin(page, link) for link in links if re.search(r"(?:^|_)sg[_\.]", Path(urlparse(link).path).name, re.I)]
        if not sg:
            raise ValueError(f"No SG PDFs on {page}; inspect the source before updating this script.")
        for url in sg:
            if not any(Path(urlparse(existing).path).name == Path(urlparse(url).path).name for existing in sources):
                sources[url] = page
        print(f"Found {len(sg)} PDFs: {page}", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        manifest = list(pool.map(archive, sources.items()))
    (DEST / "manifest.json").write_text(json.dumps(sorted(manifest, key=lambda m: m["file"]), ensure_ascii=False, indent=2) + "\n")
    print(f"Archived {len(manifest)} official PDFs.")
