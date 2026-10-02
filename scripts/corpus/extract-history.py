"""Extract historical exam text for JPDB using local OCR (no remote services)."""
import concurrent.futures
import os
from pathlib import Path
import subprocess
import tempfile
import pdfplumber
import pypdfium2

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data/extracted"

def extract(path):
    target = OUT / (path.stem + ".txt")
    if target.exists(): return f"Reused {target.name}"
    pages = []
    with tempfile.TemporaryDirectory() as temporary:
        pdf = pypdfium2.PdfDocument(str(path))
        with pdfplumber.open(path) as text_pdf:
            for index, page in enumerate(text_pdf.pages):
                text = page.extract_text() or ""
                if len(text.strip()) < 20:
                    img = Path(temporary) / "page.png"
                    pdf[index].render(scale=3).to_pil().save(img)
                    text = subprocess.run(["tesseract", str(img), "stdout", "-l", "jpn+eng", "--psm", "3"], check=True, capture_output=True, text=True, env={**os.environ, "OMP_THREAD_LIMIT": "1"}).stdout
                pages.append(text)
        pdf.close()
    target.write_text("\n\n".join(pages), encoding="utf-8")
    return f"Extracted {target.name} ({len(pages)} pages)"

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted((ROOT / "data/sources").glob("201*_sg_*_qs.pdf"))
    with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool:
        for message in pool.map(extract, files):
            print(message, flush=True)
