# Historical SG exams → JPDB

`generated/` contains UTF-8 Japanese text from the **2016–2019 spring and autumn SG exams**, including both morning and afternoon papers. Larger papers are split into files of at most approximately 25,000 characters.

In JPDB, create a custom deck and use its **Add vocabulary from text** action. Paste a generated file's text into that importer, then repeat for additional files in the same deck. JPDB performs the Japanese parsing and creates vocabulary cards. These are text-import inputs, not JPDB's account-specific native deck backups.

No account access, API keys, automatic syncing, or integration with the web app is involved.

## Regenerate

```sh
python3 scripts/corpus/extract-history.py
npm run jpdb:export
```

The official historical PDFs are scans. Extraction uses local Tesseract OCR (`jpn+eng`), so some characters or words may need correction when reviewing the deck. Original PDFs and their source links are in `data/sources/`; intermediate text is in `data/extracted/`. The generated manifest records source filenames and content hashes.

Source: IPA SG past papers, 2016–2019, morning and afternoon sessions. Copyright remains with IPA. [Official archive](https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html) · [JPDB text parsing](https://jpdb.io/).
