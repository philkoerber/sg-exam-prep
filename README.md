# SG学習室

A small SG study app with Japanese and English interfaces. Two modes: practice by topic and a 60-question, 120-minute mock exam. Active sessions stay entirely Japanese.

**No accounts, backend, database, cookies, analytics, or saved progress.** Answers and the exam timer exist only in React memory. Refreshing or leaving a study session clears it. The only browser storage is the chosen interface language (`sg-language` in localStorage). The production build is a static site.

## Run locally

Requires Node.js 22.18+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On your phone, use your computer's LAN IP on the same Wi-Fi, for example `http://192.168.1.20:3000`.

```sh
npm run build
npm start
```

The second pair builds and serves the static `out/` directory. Deploy that directory to any static host when ready. The included Node server is a local preview, not an application backend. No credentials or environment variables are required.

## Scope

- **Language:** Japanese by default. The header switch changes the home page, setup, results, and review controls. Both active practice and mock exams—including the header, footer, timer, buttons, and dialogs—stay Japanese, with the switch hidden. Results or exiting a session restore the chosen language. Questions, answer choices, original figures, and the homepage illustration always remain Japanese. If localStorage is unavailable, the switch works for the current visit.
- **Topic practice:** choose one of six topics or all topics; up to 10 random questions, immediate official-answer feedback, then a session summary.
- **Mock exam:** 48 A questions + 12 B questions, 120 minutes, free navigation and answer changes, automatic submission at the deadline, then raw accuracy and topic/subject breakdowns. Unanswered questions count as incorrect. This is not IPA's IRT scoring or a prediction of official pass/fail.
- **Data:** 120 normalized questions from IPA's 2022 full sample set and 2023–2026 published CBT subsets. Source PDFs, URLs, answer keys, page references, and SHA-256 checksums are preserved. Prose reflows on phones; tables and diagrams use original crops. The complete original layout is also available for comparison.
- **Reserved material:** 2026 public questions are excluded from normal practice and available in mocks. With no persistent history, the app does not promise a question remains unseen after a mock.
- **Historical archive:** all 2016–2019 spring/autumn SG morning and afternoon question papers, answers, and commentary are archived. They are scanned PDFs; their OCR text is used for the separate JPDB export. They are **not yet normalized into interactive app questions**. The additional three-question B sample is also archived but not imported.
- **JPDB:** 22 text-import files generated from all 16 historical question papers. See [jpdb/README.md](jpdb/README.md). No JPDB API or account integration.

## Structure

```text
src/app/                 Three pages, layout, and responsive styles
src/components/          Practice, exam, question display, session results
src/lib/study.ts          Selection, scoring, and deadline rules
src/lib/messages.ts       Japanese/English interface copy (no i18n dependency)
src/lib/corpus/           Question types and topic labels
data/sources/            Original IPA PDFs and manifest
data/questions/          Canonical normalized JSON (120 questions)
data/extracted/          Historical OCR text
data/topic-overrides.json Reviewed corrections to initial topic classification
public/question-assets/  Original question crops for tables and diagrams
scripts/corpus/          Reproducible download, extraction, normalization
jpdb/generated/          Historical exam text ready for JPDB's text importer
tests/                   Domain tests and desktop/mobile browser tests
```

The corpus has stable source-based IDs. Question selection never mutates it. Content and scoring are available in the browser: this is a self-study tool, not a secured assessment system. Mock mode hides solutions in the interface until submission.

## Rebuild the data

The PDFs and generated data are already included. Normal app development does not need Python, OCR, downloads, or external services.

For data maintenance, use Python 3.11+, `pip install -r scripts/corpus/requirements.txt`, and Tesseract with `jpn` and `eng` language data for the historical scans:

```sh
python3 scripts/corpus/download.py
python3 scripts/corpus/normalize.py
python3 scripts/corpus/extract-history.py
npm run corpus:validate
npm run jpdb:export
```

The normalizer fails on missing headings, ambiguous choices, or unmatched answers. It removes small reading annotations from extracted responsive text; original page crops retain the source. Topic labels are study categories, not official IPA metadata; reviewed corrections live in `topic-overrides.json`. Recheck rendered images when changing extraction boundaries.

Historical OCR can contain recognition errors. Never treat it as a verified interactive question bank without checking the original scans. The app's 120 active questions come from text-native PDFs and official answer keys.

## Checks

```sh
npm run typecheck
npm run lint
npm run corpus:validate
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests exercise desktop and mobile rendering, topic filtering, practice scoring, mock submission, timeout after inactivity, diagram loading, language persistence and session boundaries, and zero persisted study state. Tests use an isolated static preview on port 4173.

## Official sources and attribution

- [IPA historical papers](https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html)
- [IPA public CBT questions](https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html)
- [IPA full sample set](https://www.ipa.go.jp/shiken/syllabus/henkou/2022/20221226.html)
- [IPA reuse terms](https://www.ipa.go.jp/shiken/faq.html)

Exam materials remain copyright IPA. Educational reuse is permitted under IPA's stated conditions. Every displayed question retains attribution; layout and line breaks are adapted for display. This project is not affiliated with IPA. Historical references reflect the source publication year and may use older standards or legislation.
