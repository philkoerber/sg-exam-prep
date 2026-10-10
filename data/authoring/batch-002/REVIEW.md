# Batch 002 — published Wave 1

## Current release status — 2026-10-10

**20 published questions: 16 A + 4 B**, all ordinary-study variants of their actual official anchors. Initial independent review accepted six and requested 14 revisions. Those revisions were made, independently solved again where content changed, and all 20 current hashes were accepted. Generated keys match the committed independent answers. Source hashes, complete choice reasoning, language floors and the gated publication command passed. The original 50-question pilot was not changed or published.

- `independent-review-initial.json` and `independent-answers.json`: preserved initial findings/solves.
- `independent-answers-revision.json`: committed revised-item solves before provenance lookup.
- `independent-review.json`: 20 accepted current-content records.
- `author-review-draft.json`: preserved pre-approval author notes; `reviews.json` records final approval and its basis.
- `solve-only.json`: first-solve content without source annotations; `blind-review.json` supplies provenance only after answers are committed.
- All nine new resource entries and the cited original PDF pairs are registered in the shared catalogue.

Final aggregate overlap: **97.63% word tokens / 99.83% kanji**. All questions exceed 95% word overlap. A11 retains the necessary legal term `真正` at **98.95% kanji**, above the hard 98% floor but below the 99% target; the exception was explicitly reviewed. New kanji are `督・真・未`. Final B lengths are 1117 / 947 / 861 / 1614 characters. These metrics do not certify fluency, difficulty or IPA endorsement.

All 22 desktop/mobile browser tests passed, including rendering every new table and SVG without page overflow or clipped cells. The production static build passed. The source/version limitations below remain: unchanged facts may be supported by official question/key pairs rather than separately acquired full standards; the anonymisation case explicitly uses the cited historical report and stated assumptions; the original B03 flattened-choice defect was not repaired. That case was checked against the intact original PDF/table. Independent AI review is not native-speaker or SG-expert review.

## Historical revision-stage author packet (before approval)

The sections below preserve pre-approval observations. Their DRAFT/pending statements are historical, not the current release status above. Draft-only helpers `check.ts` and `render.tsx` are authoring artifacts; use the registered corpus review/validation commands for current checks. Do not rerun those helpers to overwrite current review exports.

Revision date: **2026-10-10**. Exactly **20 candidates**, IDs `sg-generated-batch-002-001`–`020`, in **A01–A16 / B01–B04** order. All `reviews.json` statuses remain **`"draft"`**. Nothing was published or marked author-approved or independently approved.

## Review state and preservation

The initial independent review recorded **6 accept / 14 revise**. This revision implements the requested changes; it is **not independent re-review**. No native-speaker or subject-expert accreditation is claimed.

- Accepted suffixes **001, 005, 011, 013, 015, 019** retain their bodies, choices and answers. Before source-reference cleanup, their hashes were checked against the initial review and matched.
- Every ID, anchor, inherited family/subject/topic/study pool and display format is retained. B017 still has an assessment table, five proposals and ten combinations; its assessment now separates P and Q into target rows. B018's native SVG is unchanged. B019's intact result/reason table and B020's three body tables / ten-row three-field choice matrix are preserved.
- Historical answer letters were removed from **all learner-visible `source.references[].section` values**, including the supplemental A16 reference. Precise source locations remain. Consequently **all 20 content hashes changed**, even for initially accepted bodies; the initial verdicts must not be treated as approval of the current hashes.
- `independent-review-initial.json` and `independent-review-notes.md` are byte-for-byte unchanged. The local check asserts their original SHA-256 values. Other reviewer outputs and the parent's exports were not edited.

## Specific changes

| Suffix | Implemented revision |
|---|---|
| 002 | Public/confidential documents lose their cover-only classification when selected pages are output. The answer carries the original label into the output. Alternatives compare training, original-folder access and an undifferentiated email subject. |
| 003 | A file is absent from the OS listing but present in the same folder when checked without that OS, with no deletion or movement. Concealment is compared with relocation, read-access restriction and execution-history deletion. Removed the awkward port-response wording. |
| 004 | Registration already binds names, but a later search concatenates stored names. The control must address that later SQL generation, not password strength or HTML output. The key changes to ウ. |
| 006 | Valid employee credentials are used for automated applications. Compare human-response checking alongside identity/authorization checks with replacing authentication, bypassing CAPTCHA after login, or granting approval rights. |
| 007 | Authorized external scanning connects to 443 and 8443, but only 443 is permitted. Distinguish the unexpected reachable service requiring investigation from unsupported content/version/authentication conclusions. The stem says connection success, not merely a response that could mean refusal. |
| 008 | Track C's entry-only authentication versus D's entry-and-exit authentication. Select different re-entry outcomes from four textual combinations; initial state, valid cards and no history reset are explicit. |
| 009 | Send the same large file to multiple recipients with one file-encryption operation and protected key delivery over an eavesdroppable channel. Correct public keys and a safe key-encryption facility are explicit premises. Alternatives violate processing-count or secrecy constraints. |
| 010 | Compare files necessary for B's entrusted statutory work—supervision reporting, withholding-slip production and number mapping—with A's unrelated record of its own past business. Uses PPC Q2-1①②③, not the initial performance/check/backup set. |
| 012 | Service becomes unavailable while the program is running and monitoring sends no notice; a user reports it, a spare connection restores service, and the cause remains unknown. Distinguish interruption from detection, recovery and waiting for cause identification. |
| 014 | Two accepted same-name/domain/path cookies change ID from 1 to 2. Choose the subsequent request header, distinguishing replacement from stale/duplicate values and the response header. |
| 016 | Choose a diagram for organizing unconfirmed causes of delayed replies before investigation. Removed the fish-bone shape hint; distinguish this purpose from distribution, time-series and frequency comparisons. |
| 017 | Define implementation **per assessment row and all PCs with that row's software**. P/Q are required and cannot be removed or replaced by standard software. X covers P only; Q can be patched manually. X plus manual Q management or verified Y coverage each works independently. Key changes from キ to **ケ（三・五）**. All ten reasons updated. |
| 018 | State the actual shared-area → R → reception/visitor room → Q → workroom route. Each employee holds their **own** badge; only its design is common, without department/authority information. No SVG changes or general claim that badges/cameras are useless. |
| 020 | Explicitly state that **L creates** anonymized information from its collected data and **M receives** it. Other anonymization premises, transformations and answer remain unchanged. |

`reviews.json` contains the full rule, every choice reason, precise variation, source limitations and factual author language notes. `refresh-author-notes.ts` refreshes only their current hashes and mechanical language measurements; it cannot create an independent approval.

## Sources and limits

The original authoring pass read official anchor JSON and actual question/answer PDFs. This revision used only this batch's initial independent review/notes and own files, with the existing schema, fixed language baseline and merged catalogue used by local checks. No other batch/reviewer material was inspected.

- **SQL:** own archived IPA 1-(i)-a and 1-(i)-b support binding and appropriate handling of **all literals**, not just immediate external inputs. Names are values, not SQL identifiers.
- **Cryptography:** NIST SP 800-12r1 PDF pp.62–63 §9.1.1 supports key roles; the official 2023 Q4 pair supports bulk-encryption suitability. No benchmark or arbitrary algorithm-safety claim is inferred from NIST. Recipient-key authenticity and safe key encryption are case premises.
- **My Number:** the fixed **1 April 2025 Q&A**, PDF pp.19–20 Q2-1①②③, and **June 2025 business guideline** are the stated versions. The original 2022 historical snapshots remain unavailable. The archived updating HTML FAQ is discovery evidence, not substantive support.
- **Cookies:** RFC 6265 §4.1.2's replacement passage was read, alongside the previously checked exchange/header sections. Same name/domain/path, successful storage and send conditions remove the relevant ambiguity.
- **B017/B018:** existing SME v4.0 and official pairs support the unchanged objectives, not invented tool capabilities or floorplan routes. Company assessment definitions, software necessity, tool scope and routes are explicit case facts.
- **B019:** the original malformed flattened choices were not used as drafting evidence; the intact table and actual PDF pp.36–37 were used in the original pass. No official data repair was made.
- **B020:** retains the exact PPC second edition, **May 2022 update**, pp.74, 80–84. Whole-data assessment, single-day data, removal/replacement of identifiers and required central-range precision remain explicit. The example thresholds are not universal anonymization rules, and the three transformations do not establish every legal duty.
- Official pairs corroborate unchanged tested facts, not new company facts. No syllabus-only references or 2026 question anchors. The full JIS/INSIDER texts were not separately archived; no new detailed interpretation of them is claimed.

The parent has already merged the resource catalogue. All nine archived resource entries match their registered entries/checksums, and all candidate citations are registered. No new download was needed for this revision and no required source-download blocker remains.

## Local validation

- `node --import tsx data/authoring/batch-002/refresh-author-notes.ts` — refresh current author hashes/measurements, without modifying statuses or reviewer files.
- `node --import tsx data/authoring/batch-002/check.ts` — **passed**: 20 schemas, exact order/metadata inheritance, registered citations, archived resource checksums, no source-section answer letters, complete draft reasons/current hashes, B structures/percentage widths, A13 arithmetic, language floors and reviewer-file preservation.
- `node --import tsx data/authoring/batch-002/render.tsx` — **passed** with the actual `QuestionView`: **20 questions, 1 native SVG, 7 tables, 98 radio choices**. `preview.html` is only a local author preview.
- An early revision-language pass failed for 008 (89.15% words). Necessary conditions were retained while vocabulary was revised; the current pass clears all hard floors and the word target. No filler was added to dilute novel vocabulary.
- Prior MuPDF inspection of the unchanged native floorplan is author inspection. The earlier browser screenshot attempt timed out at Chromium launch after 15 seconds; **no browser-layout pass** is claimed.

### Current fixed-120 language results

Existing `languageMetrics` only; generated text and repaired B019 text were not added to the baseline.

- Minimum word coverage: **95.2381%** (012); **20/20 reach 95%**.
- Minimum kanji coverage: **98.9474%** (011); **20/20 clear 98%, 19/20 reach 99%**.
- Novel kanji: **督** (010 `監督`), **真** (011 `真正`), **未** (020 `未満`). These are necessary legal/numeric terms, not decorative difficulty. The accepted 011 wording remains intact; its 99% target miss is not hidden with padding.
- B visible characters: **1117 / 947 / 861 / 1614**; all exceed 500.
- Full per-question metrics and novel-word lists are in `language-report.json`. Overlap is screening, not proof of natural Japanese or equal difficulty.

## Handoff

All 20 remain **DRAFT**, awaiting the parent's new answer-blind export and genuine independent re-review of the current hashes. No global report or publication gate was run while the parent was changing the export. No shared catalogue, application code, official/pilot data or other authoring directory was edited. The remaining review limitation is unperformed re-review/browser validation plus the explicit source-version limits above—not an assertion that the revised questions have already been accepted.
