"""Normalize text-native SG papers into native text, HTML tables and SVG diagrams.

Scanned legacy papers are archived separately; do not silently turn OCR into verified questions.
"""
import json
import re
from pathlib import Path
import pdfplumber
from native_blocks import page_blocks, AUDIT

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "data/sources"
OUT = ROOT / "data/questions"
KEYS = "アイウエオカキクケコサシスセソ"
OVERRIDES = json.loads((ROOT / "data/topic-overrides.json").read_text())
TOPICS = {
    "law": ["法律", "著作権", "個人情報", "不正アクセス禁止", "刑法", "適法", "法に", "法で", "法の", "労働", "派遣", "商標", "特許", "営業秘密"],
    "technology": ["暗号", "認証", "パスワード", "鍵", "認可", "署名", "TLS", "SSL", "VPN", "ファイアウォール", "ディジタル証明", "デジタル証明", "PKI", "IPsec"],
    "threats": ["攻撃", "マルウェア", "ウイルス", "ランサム", "フィッシング", "脆弱", "ボット", "ソーシャルエンジニアリング", "不正プログラム"],
    "operations": ["インシデント", "バックアップ", "監査", "復旧", "事業継続", "BCP", "ログ", "フォレンジック", "廃棄", "可用性"],
    "management": ["リスク", "ISMS", "情報資産", "セキュリティ管理", "JIS Q", "2700", "管理策", "教育", "委託", "規程", "ポリシ", "ガイドライン", "機密性"],
}

def compact(text):
    lines = [line.strip() for line in text.splitlines() if line.strip() and not re.fullmatch(r"[－−-]\s*\d+\s*[－−-]", line.strip())]
    out = ""
    for line in lines:
        space = " " if out and re.search(r"[a-zA-Z0-9]$", out) and re.match(r"[a-zA-Z0-9]", line) else ""
        out += space + line
    return out

def topic(text):
    scores = {key: sum(text.count(word) * len(word) for word in words) for key, words in TOPICS.items()}
    return max(scores, key=scores.get) if max(scores.values()) else "it"

def normalize(source, manifest):
    name = source["file"]
    sample = name == "sg_set_sample_qs.pdf"
    year = 2022 if sample else int(name[:4])
    stem = "sg-2022-sample" if sample else f"sg-{year}-public"
    expected = 60 if sample else 15
    answer_source = next(s for s in manifest if s["file"] == name.replace("_qs.pdf", "_ans.pdf"))
    with pdfplumber.open(SOURCES / answer_source["file"]) as pdf:
        answer_text = "\n".join(p.extract_text() or "" for p in pdf.pages)
    answers = {int(n): key for n, key in re.findall(r"問\s*([0-9０-９]+)\s+([" + KEYS + r"])", answer_text)}
    if len(answers) != expected:
        raise ValueError(f"{name}: expected {expected} answers, found {len(answers)}")
    pdf = pdfplumber.open(SOURCES / name)
    markers = []
    for pi, p in enumerate(pdf.pages[1:], 1):
        for w in p.extract_words():
            match = re.fullmatch(r"問\s*([0-9０-９]+)", w["text"])
            if match and w["x0"] < 75:
                markers.append((int(match[1]), pi, w["top"] - 4))
    if [m[0] for m in markers] != list(range(1, expected + 1)):
        raise ValueError(f"{name}: missing or unordered question headings: {markers}")
    questions = []
    for i, (number, pi, top) in enumerate(markers):
        end_page, end_top = (markers[i+1][1], markers[i+1][2]) if i+1 < len(markers) else (len(pdf.pages)-1, 680)
        qid = f"{stem}-{number:02}"
        texts, page_numbers, blocks = [], [], []
        graphical = False
        for pn in range(pi, end_page + 1):
            page = pdf.pages[pn]
            y0 = top if pn == pi else 60
            y1 = min(680, end_top - 10) if pn == end_page else 680
            if y1 <= y0: continue
            crop = page.crop((50, y0, min(480, page.width-20), y1))
            text = crop.filter(lambda o: o.get("object_type") != "char" or o.get("size", 10) >= 8).extract_text() or ""
            if "メ モ 用 紙" in text or "メモ用紙" in text: break
            if not text.strip(): continue
            chars = crop.chars
            if not chars: continue
            y1 = min(y1, max(c["bottom"] for c in chars) + 8)
            # Preserve figures whose bottom extends past text labels.
            objects = crop.rects + crop.lines + crop.curves + crop.images
            if objects:
                y1 = min(680, max(y1, max(o["bottom"] for o in objects) + 5))
                graphical = True
            text = page.crop((50, y0, min(480, page.width-20), y1)).filter(lambda o: o.get("object_type") != "char" or o.get("size", 10) >= 8).extract_text() or ""
            texts.append(text)
            page_numbers.append(pn+1)
            blocks.extend(page_blocks(page,(50,y0,min(480,page.width-20),y1),qid))
        full_text = "\n".join(texts)
        full_text = re.sub(r"^問\s*[0-9０-９]+\s*", "", full_text)
        matches = list(re.finditer(r"(?m)(?:^|\s)([" + KEYS + r"])\s+", full_text))
        starts = [i for i, m in enumerate(matches) if m[1] == "ア"]
        if not starts: raise ValueError(f"{qid}: no choices")
        matches = matches[starts[-1]:]
        choices = [{"key": m[1], "text": compact(full_text[m.end():matches[j+1].start() if j+1 < len(matches) else len(full_text)])} for j, m in enumerate(matches)]
        found = [c["key"] for c in choices]
        if not choices or found != list(KEYS[:len(found)]) or answers[number] not in found:
            raise ValueError(f"{qid}: ambiguous choices {found}; manual normalization needed")
        prompt = compact(full_text[:matches[0].start()])
        subject = "A" if number <= (48 if sample else 12) else "B"
        if blocks and blocks[0]["type"] == "paragraph": blocks[0]["text"]=re.sub(r"^問\s*[0-9０-９]+\s*","",blocks[0]["text"])
        if qid == "sg-2022-sample-48":
            blocks = [b for b in blocks if b.get("text") != "単位 千円 単位 千円"]
        label = f"情報セキュリティマネジメント試験 {year}年度 {'サンプル問題' if sample else '公開問題'} 問{number}"
        questions.append({
            "id": qid, "year": year, "number": number, "era": "sample" if sample else "cbt", "subject": subject,
            "topic": OVERRIDES.get(qid, topic(prompt)), "pool": "benchmark" if year == 2026 else "study",
            "prompt": prompt, "choices": choices, "answer": answers[number],
            "display": "structured" if graphical or subject == "B" else "text", "blocks": blocks,
            "source": {"label": label, "url": source["url"], "answerUrl": answer_source["url"], "file": name, "pages": page_numbers},
        })
    pdf.close()
    (OUT / f"{stem}.json").write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n")
    print(f"Normalized {len(questions)} questions from {name}", flush=True)

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((SOURCES / "manifest.json").read_text())
    manifest = list({m["file"]: m for m in reversed(manifest)}.values())
    (SOURCES / "manifest.json").write_text(json.dumps(sorted(manifest, key=lambda m: m["file"]), ensure_ascii=False, indent=2) + "\n")
    for source in sorted(manifest, key=lambda m: m["file"]):
        if re.fullmatch(r"202[3-6]r\d+_sg_qs.pdf|sg_set_sample_qs.pdf", source["file"]):
            normalize(source, manifest)

    (ROOT / "data/native-content-audit.json").write_text(json.dumps(AUDIT, ensure_ascii=False, indent=2) + "\n")
