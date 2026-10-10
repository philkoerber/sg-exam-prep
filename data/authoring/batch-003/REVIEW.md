# Batch 003 — published Wave 2

## Current release status — 2026-10-10

**20 published questions: 16 A + 4 B**, all study-only variants in distinct official families. Initial independent review accepted 18 and requested improved distractors in 002 and 006. Both were revised. Because the initial metadata-bearing packet exposed original-source answer annotations for 001–004, a fresh reviewer independently solved 001–004 and 006 from the new source-free packet, committed answers, then checked provenance. All five were accepted. The final review set combines those five records with the unchanged accepted records for the other 15 questions.

- Initial solves/findings and their protocol caveat remain in `independent-answers.json`, `independent-review-initial.json` and `independent-review-notes.md`.
- Fresh committed solves and reviews are in `independent-answers-followup.json` and `independent-review-followup.json`.
- `independent-review.json` contains the 20 accepted current-hash records. All independent answers match the generated keys.
- `author-review-draft.json` preserves pre-approval author notes; `reviews.json` records final approval and the evidence used.
- `solve-only.json` contains no source metadata or answers. Provenance in `blind-review.json` is read only after a reviewer commits answers.
- The six archived primary resources and all cited original PDF pairs are now registered in the shared catalogue.

Final aggregate overlap: **96.90% word tokens / 99.69% kanji**. All 20 reach the per-question 95% word / 99% kanji targets; the B lengths remain 1016 / 926 / 1562 / 917 characters. Language, source/hash and publication gates passed. This is independent AI review, not native-speaker, SG-expert or IPA approval.

All 22 desktop/mobile browser tests passed, including all new case tables and panels without page overflow or clipped cells. The production static build passed.

The original source limits remain explicit: no independently acquired full JIS text, and no successful separate retrieval of METI DX Report 2. The DX item applies the attributed definitions in the official IPA question, not an invented later-report definition. Changed implementation facts are case premises, not universal vendor claims. The original pilot remains unpublished.

## Historical authoring record (before approval)

The sections below preserve draft/revision-stage observations; their pending statements are historical. `validate-local.ts` is a draft-only authoring helper that writes author reports; do not use it to overwrite current review/export records. Use the registered corpus validation and test commands for current release checks.

**2026-10-10 · DRAFT ONLY · NOT APPROVED · NOT PUBLISHED (historical authoring stage)**

This packet contains exactly the second planned wave: **A17–A32 + B05–B08**, in that order, with IDs `sg-generated-batch-003-001` through `sg-generated-batch-003-020`. There are **16 A + 4 B**, all `study`, in 20 distinct official families. Every question inherits its anchor's exact `familyId`, `subject`, `topic`, and `pool`. There are no 2026 official-question references. The unchanged 120-question official corpus, including its benchmark text, is used **only as the fixed language-screening baseline**.

Only `data/authoring/batch-003/**` and `data/resources/batch-003/**` were written. No shared catalogue, code, official questions, pilot data, runtime import, or published question bank was changed by this work.

## Files and review status

- `questions.json`: the actual 20 candidate records, not placeholders or a published bank.
- `reviews.json`: author rationale, reasoning for **every** choice, specific changes from each anchor, factual source/language notes, and current content hashes. All records have `status: "draft"` (the existing review format's spelling of DRAFT).
- `blind-review.json`: legacy export with generated answers removed but source annotations retained. **Do not use it for a fresh initial solve:** annotations disclose original-anchor answer information, and its 002/006 content is now stale. Local validation intentionally leaves this file untouched; the parent will regenerate exports including the safer `solve-only.json`.
- `language-report.json`: unmodified `languageMetrics` results, all novel tokens/kanji, official-file SHA-256 values, weighted batch coverage, and reading-length comparisons.
- `validation-report.json`: local checks, financial recomputation, timing check, catalogue-registration dependencies, and remaining review limitations.
- `resources.json`: six proposed catalogue entries. All IDs start `batch-003-`; all files are under `data/resources/batch-003/`; all hashes are computed from the archived bytes; all retrieval dates are `2026-10-10`.
- `source-excerpts.txt`: author working extracts from the actual official question/answer PDFs and existing local guidance, with 1-based PDF page labels. These are not replacements for the PDFs or a new authoritative resource.
- `validate-local.ts`: batch-local reproducible validation/report export; no global catalogue modification, review-packet export, or publication operation.
- `independent-answers.json`, `independent-review-initial.json`, `independent-review-notes.md`: initial reviewer's records, preserved unchanged.
- `revision-report.json`: author-side integrity checks, revised content hashes, and unchanged reviewer-file SHA-256 values.

**Fresh independent reviewer:** wait for the parent's current `solve-only.json` export and commit the solve before reading provenance, `blind-review.json`, `questions.json`, author notes, or source answer keys. The initial reviewer recorded 18 accept / 2 revise, but source annotations for 001–004 were exposed before solving. These were **original-anchor annotations, not generated answer keys**. The parent will obtain a fresh source-blind review of 001–004; revised 006 also requires a fresh review. No author approval or publication is inferred from the initial verdicts.

## Revision after initial review

Only question records **002 and 006** and their author rationale/hash records were changed. All other 18 question and author-review records, including 001/003/004, remain identical to their pre-revision records. The three independent-reviewer files retain identical SHA-256 values; see `revision-report.json`.

- **002:** retained the company Web-access case and qualified correct answer. Replaced the encryption-implies-mandatory-firewall-permission distractor with the HTTPS/80-port misconception alone. Replaced the TCP/80-is-always-safe distractor with a DNS zone-transfer/80-port misconception. The original anchor's protocol/port reasoning is preserved.
- **006:** retained the internal-system access-management case but asks for the concept's explanation, not a premise. Options now coherently describe a zero-day condition, zero-knowledge proof, behavior-based detection, and zero trust at comparable descriptive granularity. Removed the unnatural “protect only these vulnerabilities” and “trust all internal access after detection” claims.
- Both generated answer keys and source-reference objects are unchanged. Updated hashes bind the revised wording; initial verdicts must not be copied onto those hashes.
- All 20 author statuses remain `draft`. Unchanged author notes were originally written before the initial independent review and are preserved as historical author notes; reviewer findings are in the separate immutable files. Fresh review of changed content remains pending.
- No global report or review-export command was run. The local checker no longer regenerates the metadata-bearing blind export, leaving safe export generation to the parent.

## Anchors and language screening

Body, captions, table cells and choices are counted. Generated choices are stored only in `choices`, never duplicated in body blocks. Official structured anchors contain duplicated choice text; the **reading-length comparison only** removes their trailing duplicated choices. The baseline supplied to `languageMetrics` is unchanged.

| ID suffix | Slot | Official anchor | Words | Kanji | Characters | Display length / anchor |
|---|---|---|---:|---:|---:|---:|
| 001 | A17 | `sg-2025-public-01` | 100.00% | 100.00% | 225 | 0.89× |
| 002 | A18 | `sg-2022-sample-15` | 99.34% | 100.00% | 347 | 1.14× |
| 003 | A19 | `sg-2024-public-04` | 96.43% | 100.00% | 212 | 0.84× |
| 004 | A20 | `sg-2022-sample-07` | 98.97% | 100.00% | 191 | 1.20× |
| 005 | A21 | `sg-2022-sample-09` | 96.82% | 100.00% | 360 | 0.92× |
| 006 | A22 | `sg-2025-public-03` | 98.25% | 100.00% | 239 | 1.13× |
| 007 | A23 | `sg-2022-sample-35` | 96.08% | 100.00% | 181 | 1.34× |
| 008 | A24 | `sg-2023-public-09` | 99.28% | 99.16% | 278 | 1.14× |
| 009 | A25 | `sg-2022-sample-32` | 98.67% | 100.00% | 139 | 1.39× |
| 010 | A26 | `sg-2022-sample-37` | 96.49% | 100.00% | 99 | 1.52× |
| 011 | A27 | `sg-2022-sample-46` | 100.00% | 100.00% | 157 | 1.25× |
| 012 | A28 | `sg-2022-sample-48` | 97.44% | 100.00% | 174 | 1.03× |
| 013 | A29 | `sg-2023-public-11` | 96.61% | 100.00% | 218 | 0.81× |
| 014 | A30 | `sg-2024-public-11` | 97.04% | 99.16% | 254 | 0.89× |
| 015 | A31 | `sg-2025-public-11` | 97.87% | 100.00% | 97 | 1.10× |
| 016 | A32 | `sg-2025-public-12` | 95.79% | 99.57% | 562 | 0.94× |
| 017 | B05 | `sg-2022-sample-60` | 95.43% | 99.46% | 1,016 | 1.10× |
| 018 | B06 | `sg-2022-sample-59` | 95.29% | 100.00% | 926 | 0.97× |
| 019 | B07 | `sg-2023-public-15` | 97.32% | 99.61% | 1,562 | 0.90× |
| 020 | B08 | `sg-2024-public-15` | 96.69% | 99.06% | 917 | 1.01× |

- **All 20 meet the 95% word / 99% kanji targets**, and therefore the 90% / 98% hard floors.
- Weighted batch overlap: **96.9013% words** (4,163 word tokens) and **99.6904% kanji** (3,230 kanji occurrences).
- Minimum word coverage: **95.29%**, B06. Minimum kanji coverage: **99.06%**, B08.
- All B cases exceed 500 characters without repeated choices or unrelated padding.
- The 80–120% reading-length band remains a **review prompt**, not a validity gate. A20 is fractionally above 1.20 before rounding; A23/A25/A26/A27 are also above the band. Their short originals gained explicit scope, actual disruption, delegated responsibilities, or explicit beneficiaries. Native-speaker/difficulty review should assess whether these additions make them too easy or too verbose; no length-equivalence claim is made.
- Novel tokens are listed in full in `language-report.json` and noted per question in `reviews.json`. Segmentation fragments such as `動`/`かし`, `置`/`換え`, `いたこ`, and `わら` are not rewritten into unnatural Japanese to improve scores. Necessary words such as クリップボード, 返品, 返金, 窓口, and 閉じる remain.
- The initial A27 draft failed both hard coverage floors. The final version replaces its unusually sparse-baseline environmental vocabulary with normal regional employment/environmental-improvement wording; the target beneficiary and reasoning are unchanged. The failed draft was not approved.

## Source inspection, versions and catalogue handoff

The actual official JSON, referenced problem pages and answer PDF p. 1 were inspected for all 20 anchors. Sections in each generated `source.references` identify the question, PDF page(s), and original answer-key row. The official key supports the **unchanged concept/reasoning**, not an IPA answer for the new question.

### Parent-managed official registrations

Per the request, these existing official-PDF IDs are used as factual evidence for unchanged concepts, but were **not added to the shared catalogue here**:

- `ipa-sg-2022-sample-questions`, `ipa-sg-2022-sample-answers`
- `ipa-sg-2023-public-questions`, `ipa-sg-2023-public-answers`
- `ipa-sg-2024-public-questions`, `ipa-sg-2024-public-answers`
- `ipa-sg-2025-public-questions`, `ipa-sg-2025-public-answers`

The parent has now registered all eight official-PDF IDs and merged the six batch-003 resource entries. Revision-time local validation found no unregistered references and confirmed that the six local entries exactly match the shared catalogue. The local validator now requires actual catalogue registration rather than the earlier promised-ID allowance. No shared catalogue edits were made here.

### New archived primary resources

| Proposed ID | Actual inspected support | Version/boundary |
|---|---|---|
| `batch-003-cryptrec-about` | HTML §1, first sentence: evaluation and monitoring of electronic-government recommended cryptography | Retrieved 2026-10-10; no new algorithm selection or current committee-membership question |
| `batch-003-penal-code` | e-Gov XML Article 234-2(1), destructive interference/unlawful instructions causing business obstruction | Retrieval snapshot, not a 2022 historical edition. Current XML uses 拘禁刑; **no penalty wording is tested** |
| `batch-003-ipa-bec-about` | Official landing page linking the report | Discovery/provenance only; not used as standalone proof of the evidence classifications |
| `batch-003-ipa-bec-report` | PDF p. 7 §1.2 type 1; p. 11 §3.2.1 genuine invoice reuse and correspondence; p. 12 §3.2.2 lookalike domains; p. 17 account/settings investigation | **Second edition, 2023-02-09**, verified on PDF p. 3. Findings 1/4/6 instantiate the same original evidence categories |
| `batch-003-ipa-fakealert` | Introductory warning and §2 browser-closing operation | Page says last updated **2024-11-19**; no assertion that a clean scan proves safety |
| `batch-003-ipa-fakealert-close` | PDF p. 3 environment caveat; p. 4 §2.1 Esc/close; p. 6 browser reopening caution | **Ver.1.00, 2023-11-15**, verified cover. Generated case explicitly confirms its PC supports the described close method |

Existing resources actually checked:

- `ipa-sme-4.0`: PDF p. 33 minimum necessary permissions/privilege concentration; p. 36 antivirus definitions/update frequency.
- `ipa-cloud-4.0`: PDF p. 6 user scope and supervisory approval-permission example.
- `ipa-incident-4.0`: PDF p. 3 reporting, impact-sensitive response organisation, timely management reports and recurrence prevention; p. 4 isolation and updating definitions before checking.
- `caa-email`: PDF pp. 1–2 introduction and scope of advertising email, for the replacement statutory distractor in A25.

### External/version limitations — not hidden as approvals

1. **METI DX Report 2 remains externally unverified.** The plan records 403/page-not-found retrieval failures; no new successful original-report retrieval is claimed. A32 reproduces the three definitions actually present in **IPA 2025 question 12, PDF p. 7**, and visibly attributes the table to that IPA page and its stated DX Report 2 origin. The task is explicitly application of this supplied table. No DX Report 2.1/2.2 substitution was made.
2. **JIS Q 31000:2019 full standard was not independently acquired.** A17 remains limited to the original official question's process-definition distinction. No later edition, extra JIS clause, or numerical risk formula is introduced.
3. For HTTP/command communication, kill chains, VDI, zero trust, testing, internal-control responsibility, stakeholder benefits, financial statements, BPM, RPA and data marts, factual references deliberately use the exact historical official problem/key under the user's allowed fallback. This is **not** a claim that every additional primary-source task in the plan was independently completed. No new vendor behaviour, product feature, mandatory audit rule or accounting rule is asserted from the syllabus. The changed company facts are explicit premises.
4. Updated legal/guide snapshots are not represented as historical exam editions. A25 avoids the obsolete original provider-law distractor and tests classification, not penalties or legal advice.

## Preserved structures and explicit premises

- **A21 / 005 (VDI):** browsing moves to a DMZ virtual desktop; direct Web access, clipboard, shared drives and file transfer back to the internal PC are disabled. This is a configuration premise, not a claim that every VDI implementation automatically isolates files. Protection is limited to the stated browsing/file-transfer paths.
- **A24 / 008 (incident audit):** shared intake is a valid distractor when it routes cases correctly. The defect is explicitly failing to forward service outages/leak concerns to the case-defined responsible parties, not simply having one help desk.
- **A28 / 012:** two native financial tables, merged headings, meaningful blank calculated values. From displayed inputs: total manufacturing expense 960; manufacturing cost 900; cost of sales 950; gross profit 450 thousand yen. All four option calculations are separately recomputed from the cells by `validate-local.ts`. This is an author's programmatic cross-check, **not an independent reviewer's calculation**.
- **A32 / 016:** exact three-stage definition table retained. The new enterprise transformation coordinates design/manufacturing/maintenance/partners around customer use and changes product sales to usage-based business. Local digitisation/automation alternatives remain distinct.
- **B05 / 017:** seven numbered findings plus a separate account-compromise/settings finding; ten three-number choices. Correctness depends on legitimate-looking document/history/identity evidence, not just naming BEC. Similar domains can also be warning signs on inspection; the stem asks their role in appearing genuine. No specific malicious forwarding rule is inferred.
- **B06 / 018:** two-step workflow panel, old policy plus new outsourcing requirements, a view/input/approve matrix with a two-row merged header and ungranted empty cells, five role choices. Returns/refunds replace order entry, and final approval moves from sales to the client's accounting role. This role allocation is a case requirement, not a universal outsourcing law.
- **B07 / 019:** authentication and connectivity context, protection settings, **eleven-bullet** employee report, investigation result, five prose choices. Publication 10:07 is distinguished from availability 10:08. A 10:15 fetch applies by 10:17, before 10:24 opening; a 10:00 fetch cannot obtain the new definition. Direct Internet access without VPN, completion within two minutes, and detection/blocking with the new definition are all explicit premises. Fifteen minutes is not presented as an IPA-mandated interval or a guarantee against every malware.
- **B08 / 020:** employee report, boxed three-finding investigation, five prose choices; no screenshot. No installation, remote access, contact or payment occurred. The genuine-product/Web-page distinction comes from investigation, not logo or urgency, and not a clean scan alone. The safe closing method is confirmed internally for the case PC.

## Validation actually run

From the project root:

```sh
node --import tsx data/authoring/batch-003/validate-local.ts
```

Final local validation passed:

- All 20 records parsed with the actual `questionSchema`, including native table grid/span validation.
- Exact ID order, 16/4 subject allocation, 20 unique study families, exact anchor metadata inheritance, no 2026 question references.
- Sequential/unique choice keys, nonempty/distinct options, no exact official-text duplicate, complete per-choice author reasoning, all statuses DRAFT.
- New resource bytes/checksums, retrieval dates and restricted resource paths.
- Required table/panel/choice counts, financial arithmetic for every option, signature-update time comparison.
- Current author hashes generated with the existing `questionDigest`; local language and validation reports refreshed. Review exports are deliberately deferred to the parent.
- All hard language floors and B lengths; all per-question 95%/99% targets also met.
- Editor diagnostics for `validate-local.ts`: **no errors or warnings**.

**Not run / not claimed in this revision:** a fresh independent solve of changed content, fresh source-blind review of 001–004, native-speaker or SG-expert review, desktop/mobile browser rendering, global corpus/report commands, application tests/build/e2e, approval, or publication. The initial reviewer's completed source/structure checks and protocol limitation remain documented in their untouched files. Global checks and safe solve-only export generation remain assigned to the parent. The publication validator is not an appropriate success target for intentionally unapproved drafts.

The next gate is the parent's fresh solve-only review of 001–004 and revised 006, including the repaired distractor plausibility and descriptive consistency. Any remaining rendering checks also stay pending. Any subsequent content change requires renewed hashes, metrics and review. Machine overlap and author arithmetic do not establish IPA endorsement, calibrated difficulty or IRT equivalence.
