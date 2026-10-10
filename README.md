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

- **Language:** Japanese by default. The header switch changes the home page, setup, results, and review controls. Both active practice and mock exams—including the header, footer, timer, buttons, and dialogs—stay Japanese, with the switch hidden. Results or exiting a session restore the chosen language. Questions, answer choices, diagram labels, and the homepage illustration always remain Japanese. If localStorage is unavailable, the switch works for the current visit.
- **Topic practice:** choose one of six topics or all topics; up to 10 random questions, immediate answer feedback, then a session summary.
- **Mock exam:** 48 A questions + 12 B questions, 120 minutes, free navigation and answer changes, automatic submission at the deadline, then raw accuracy and topic/subject breakdowns. Unanswered questions count as incorrect. This is not IPA's IRT scoring or a prediction of official pass/fail.
- **Data:** 160 active questions: 120 normalized originals from IPA's 2022 full sample set and 2023–2026 published CBT subsets, plus 40 independently AI-reviewed generated variants in two batches. Original PDFs, URLs, answer keys, page references, and SHA-256 checksums are preserved; generated answers are not IPA answers. All active exam content is native: responsive text, 47 HTML tables, 27 boxed text sections, and three SVG diagrams with selectable labels. Wide tables and diagrams scroll inside the question on phones. Original PDF links remain available for comparison; no exam screenshots or bitmap assets are shipped.
- **Reserved material:** the 15 official 2026 questions are excluded from normal practice and available in mocks. All 40 published variants use earlier study anchors, bringing ordinary practice to 145 questions. With no persistent history, the app does not promise a question remains unseen after a mock.
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
data/questions/official/ Canonical official JSON (120 questions)
data/questions/generated/ Published, reviewed generated questions
data/authoring/pilot-001/ Original 50-question pilot (still unpublished)
data/authoring/batch-002/ First new batch: 16 A + 4 B, source and review records
data/authoring/batch-003/ Second new batch: 16 A + 4 B, source and review records
data/resources/          Versioned learning references and checksum catalogue
data/extracted/          Historical OCR text
data/topic-overrides.json Reviewed corrections to initial topic classification
data/native-content-audit.json Character-preservation checks for converted PDF regions
scripts/corpus/          Reproducible download, extraction, normalization
jpdb/generated/          Historical exam text ready for JPDB's text importer
tests/                   Domain tests and desktop/mobile browser tests
```

The corpus has stable IDs and explicit `source.kind` values (`official` or `generated`). A `familyId` groups close variants and re-published questions. Selection first samples families uniformly, then a member; a session never includes two questions from the same family. Large variant families do not gain extra sampling weight. Question selection never mutates the corpus. Content and scoring are available in the browser: this is a self-study tool, not a secured assessment system. Mock mode hides solutions in the interface until submission.

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

The normalizer fails on missing headings, ambiguous choices, unmatched answers, unsupported embedded bitmaps, or missing/extra characters in converted PDF regions. Native tables retain merged cells; the schema rejects overlapping or incomplete grids. Two financial statements use explicit table layouts that preserve their five empty answer boxes. SVG paths and text positions come from the original PDF vectors, with no raw HTML injection. Small reading annotations are omitted from ordinary prose; the original PDFs retain them. Topic labels are study categories, not official IPA metadata; reviewed corrections live in `topic-overrides.json`. Review desktop and phone renderings against the source PDFs when changing extraction boundaries. Re-running the normalizer reproduces the native blocks and extraction audit.

Historical OCR can contain recognition errors. Never treat it as a verified interactive question bank without checking the original scans. The 120 official questions come from text-native PDFs and official answer keys. See [the authoring guide](data/authoring/README.md) for the unpublished pilot, published batches and review/publication gates.

## Generated question batches

| Batch | A / B | Status |
|---|---:|---|
| `pilot-001` | 40 / 10 | Original drafts, still unapproved and unpublished |
| `batch-002` | 16 / 4 | Published after independent AI review and revision |
| `batch-003` | 16 / 4 | Published after independent AI review and revision |

Canonical authoring records remain separate from published inputs. The two new batches vary 40 distinct official study families; they do not add 40 new concepts or change family sampling weights. Each retains an actual concept/reasoning anchor, factual references and per-choice reasoning. Native tables, panels and a floor plan preserve the case-study formats. The frontend has the same screens and controls; generated records never receive a fabricated official year or official-answer link. Original source links remain on original questions.

```sh
npm run corpus:review -- batch-002
npm run corpus:publish -- batch-002
npm run corpus:review -- batch-003
npm run corpus:publish -- batch-003
```

Omitting the batch ID retains the original pilot behavior. Review exports include `solve-only.json` without answers or source metadata, followed by `blind-review.json` for provenance checks after reviewers commit their answers. Language screening always uses the fixed official corpus, not other generated questions. Publication requires current author approval and an accepted independent review with a matching answer; revisions invalidate old hashes. The build checks all registered batches, runtime imports and source checksums, and rejects unreviewed/stale published content or benchmark leakage. Initial findings and pre-approval author records are retained.

The new batches' aggregate kanji overlap is 99.83% and 99.69%; overlap is not a fluency or difficulty guarantee. Independent AI review is not native-speaker, SG-expert or IPA validation. See each batch's `REVIEW.md` for source/version limitations, including explicit historical anonymisation context and DX definitions sourced from the official question rather than a separately retrieved METI report. No generation, AI calls, review records, reference PDFs or review dependencies are loaded by the app.

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

Browser tests exercise desktop and mobile rendering, topic filtering, practice scoring, mock submission, timeout after inactivity, all native tables/diagrams, language persistence and session boundaries, and zero persisted study state. Tests use an isolated static preview on port 4173.

## Official sources and attribution

- [IPA historical papers](https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html)
- [IPA public CBT questions](https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html)
- [IPA full sample set](https://www.ipa.go.jp/shiken/syllabus/henkou/2022/20221226.html)
- [IPA reuse terms](https://www.ipa.go.jp/shiken/faq.html)

Official exam materials remain copyright IPA. Educational reuse is permitted under IPA's stated conditions. Every official question retains attribution; layout and line breaks are adapted for display. This project is not affiliated with IPA. Historical references reflect the source publication year and may use older standards or legislation.
