# Batch 003 — independent initial review

## Result and scope

- Exactly **20 candidates** reviewed from `blind-review.json`.
- **18 accept / 2 revise**. Revise: **A002, A006**, both for distractor design / comparable reasoning quality, not an incorrect or non-unique answer.
- The `answer` in each review is the independent solution, not a generated author key. Hidden-answer comparison remains the parent's task.
- Wrote only `independent-answers.json`, `independent-review-initial.json`, and this note in `data/authoring/batch-003/`.
- No author edits, approvals, publication, commits, or branches.
- Did not open `questions.json`, `reviews.json`, `REVIEW.md`, `validate-local.ts`, author `source-excerpts.txt`, `validation-report.json`, generated output, or answer-bearing scratch files. The initial directory listing showed names only.

## Important protocol limitation

The first read of `blind-review.json`, lines 1–220, exposed not just bodies and choices but the embedded `source.references` annotations for **001–004**, including descriptions of the official anchor's correct concept and official-anchor key labels. This was disclosed immediately in the conversation. It was **not** a read of generated author answers, but it means strict source/official-answer blindness cannot be certified for these four items.

After recognizing that the blind file contained those annotations, the remainder of the solve view was filtered in memory to `id`, `contentHash`, `display`, `blocks`, and `choices` only. All 20 solutions, including option-by-option reasoning, were then saved in `independent-answers.json` **before any separate source, official anchor JSON, or official answer-PDF lookup**. That answer file was not subsequently edited. “Committed solves” here means this saved immutable-for-review record, not a Git commit.

For **005–020**, no source-reference annotations or official answers were displayed before the answer file was written. A016's table contains its own printed attribution, which is part of the question body; no external source was opened during solving.

If the parent requires a fully source-blind record for every candidate, rerun **001–004 with another fresh reviewer** using a body/choices-only export. This review must not be represented as perfectly source-blind for all 20. Candidate verdicts below concern content quality; this procedural limitation is separate.

## Method

1. Solve from the filtered body and choices; write all 20 independent answers.
2. Read the `BlindReview` type at `scripts/validate-pilot.ts:20–27` without importing or executing the validator. Output is an array with exactly `questionId`, `contentHash`, `answer`, `verdict`, `issues`, `reasoning` per record.
3. Resolve every referenced resource through `data/resources/catalog.json`. All **17 distinct cited local resources** exist and their SHA-256 values match the catalog. This verifies local-file identity, not an independent fresh web retrieval.
4. Read the cited pages directly from the source PDFs using PyMuPDF, and read the cited HTML/XML directly. No author excerpts or extracted/generated answer files were used.
5. Inspect the 20 official anchor records from the four `data/questions/official/sg-{2022-sample,2023-public,2024-public,2025-public}.json` files, then the corresponding official answer PDFs. The official keys agree with the anchors and cited references; their labels are not used as generated-candidate keys.
6. Check every choice, unique defensible answer, Japanese wording, source scope/version, format, and reasoning load. Official question + key is treated as evidence for unchanged basic concepts, not as authority for new case-specific facts.
7. Independently calculate A012 and B019; expand B018's merged header cells and compare the original PDF's column coordinates; inspect B017 and B020's supplementary evidence.

## Item-level source and disposition map

All page numbers below are **PDF page indices**, not necessarily printed page numbers. Full option reasoning is in both JSON deliverables, with source judgments added to the initial review.

| Candidate | Independent answer | Verdict | Official anchor / question pages | Additional evidence |
|---|---|---|---|---|
| A001 | イ | accept | 2025 Q1, p.2 | JIS basic analysis concept only; not a full JIS text audit |
| A002 | ア | **revise** | 2022 Q15, p.7 | HTTP/firewall possibility retained; revise implausible distractors |
| A003 | エ | accept | 2024 Q4, p.3 | Attack-stage concept, no new seven-stage taxonomy claim |
| A004 | ウ | accept | 2022 Q7, p.3 | CRYPTREC about HTML, §1 first sentence |
| A005 | イ | accept | 2022 Q9, p.4 | Extra VDI restrictions are explicit company premises |
| A006 | エ | **revise** | 2025 Q3, p.3 | Restore coherent related-concept distractors |
| A007 | ア | accept | 2022 Q35, p.14 | Test coverage, not a claim of a new audit-standard clause |
| A008 | ウ | accept | 2023 Q9, p.6 | Incident 4.0, p.3 |
| A009 | ウ | accept | 2022 Q32, p.13 | Penal Code XML Article 234-2(1); CAA email pp.1–2 |
| A010 | イ | accept | 2022 Q37, p.14 | Unchanged management-responsibility concept |
| A011 | エ | accept | 2022 Q46, p.17 | Direct local benefits are case premises |
| A012 | イ | accept | 2022 Q48, p.18 | Independent recomputation of both tables and all distractors |
| A013 | ウ | accept | 2023 Q11, p.6 | BPM versus CRM / ERP / SCM |
| A014 | ア | accept | 2024 Q11, p.5 | Cross-department RPA process review |
| A015 | イ | accept | 2025 Q11, p.6 | Department-specific data mart |
| A016 | ウ | accept | 2025 Q12, p.7 | All definition-table cells exactly match official anchor JSON |
| B017 | ウ | accept | 2022 Q60, p.42 | BEC 2nd ed., pp.3, 7, 11, 12, 17 |
| B018 | ウ | accept | 2022 Q59, pp.40–41 | SME 4.0 p.33; Cloud 4.0 p.6 |
| B019 | イ | accept | 2023 Q15, pp.12–14 | SME 4.0 p.36; Incident 4.0 pp.3–4 |
| B020 | エ | accept | 2024 Q15, pp.12–13 | IPA fake-alert HTML; close procedure v1.00 pp.1, 3, 4, 6 |

## Required fixes for the parent

### A002 — plausible technical misconceptions, not implausible guarantees

- Replace エ's claim that TCP/80 cannot contain malicious material. It is much less credible than the official anchor's confusion between real protocols/ports. A concrete direction is the original family of **DNS zone-transfer port versus HTTP port** misconceptions.
- In イ, remove the extra claim that encryption makes a firewall **always** permit traffic. Test the HTTPS/port misconception without stacking an unrelated obvious falsehood onto it.
- Keep ア's qualified “may match the browsing allow rule.” Do not turn it into a blanket firewall-bypass guarantee.
- The current correct answer is unique. These are assessment-quality fixes; after changing choices, regenerate the content hash and obtain a new blind review rather than copying this verdict onto changed content.

### A006 — restore related concepts and align the question's level

- Replace ア's “protect only vulnerabilities without a published countermeasure” with a coherent description of **zero-day conditions or their handling**.
- Replace ウ's “behavioral detection means all internal access is trusted” with a coherent description of **behavior-based malware detection**, without appending the opposite of the correct answer.
- Align the stem and all options: asking for the **description of the zero-trust concept**, rather than a “premise” contrasted with a proof procedure, would permit a clean comparison among zero trust, zero day, zero-knowledge proof, and behavior-based detection.
- Preserve エ's central distinction: internal network location is not sufficient grounds for trust.

## Targeted independent checks

### A012 — two financial tables

All amounts are in thousands of yen:

```text
Current manufacturing costs = 520 + 280 + 160 = 960
Cost of goods manufactured  = 960 + 180 - 240 = 900
Cost of goods sold          = 140 + 900 - 90 = 950
Gross profit               = 1,400 - 950 = 450 → イ
```

Every distractor has a concrete error model:

- ア 390: omit the work-in-process inventory adjustment, `1400 - (140 + 960 - 90)`.
- ウ 500: omit the finished-goods inventory adjustment, `1400 - 900`.
- エ 550: reverse the finished-goods beginning/ending signs, `1400 - (900 - 140 + 90)`.

The source's original figures independently yield `900 → 800 → 850 → 150`, matching its official answer. The new tables use the same accounting relationships, not a new accounting assumption.

### B018 — merged headers and role semantics

Expansion of the stored `rowSpan` / `colSpan` values gives:

```text
利用者 | Jシステムの操作権限 [three columns]
       | 閲覧 | 入力 | 承認
a      |  ○   |      |  ○
```

All table rows occupy exactly four columns without overlap or holes. `headerRows` is 2. The original PDF p.41 has its first permission marks under the **閲覧** and **承認** text coordinates, not 入力; the simplified candidate preserves this meaning.

The five roles map consistently:

| Role | View | Input | Approve |
|---|---|---|---|
| A accounting approver | yes | no | yes |
| A sales returns operator | yes | yes | no |
| A sales manager | yes | no | no |
| B returns operator | yes | yes | no |
| B business manager | yes | no | no |

The old sales-manager approval is explicitly removed by requirements 2–3. B's manager's “checking” is explicitly not the system approval operation. The source guidance supports privilege management; it does **not** impose accounting-department approval as a universal rule.

### B019 — acquisition and application are not publication or saving

```text
10:07  definition published
10:08  definition obtainable by D's PC
10:15  next quarter-hour update starts
10:16  attachment saved
10:17  latest possible completion of new definition application
10:24  attachment first opened; on-open scan runs
```

Only イ ensures a new-definition scan before execution. Saving at 10:16 need not wait for the update because the specified decisive scan is at opening. ウ's 10:00 start fetches what was then available, before the new definition; its next scheduled new-definition opportunity is 16:30. VPN changes, rescanning with the same old definition, and unknown-sender-only deletion do not block this infection.

The precise schedule, two-minute application bound, on-open prevention, and infection route are explicit case premises. Neither the official question nor SME guidance is used to claim that 15-minute updates universally prevent malware.

### B017 — BEC evidence, not inference beyond the facts

- Items **1, 4, 6** make the mail resemble a continuation of legitimate business.
- Items **2, 3, 5, 7** are anomalies / coercive cues, not authenticity cues.
- All ten combinations were checked; only ウ contains exactly 1,4,6.
- BEC 2nd edition was verified from PDF p.3 (2023-02-09).
- PDF p.7 supports advance access to genuine transaction information; p.11 supports reuse of real invoices and manipulation of quoted exchanges; p.12 supports one-character lookalike domains; p.17 supports investigating unauthorized access and suspicious account settings.
- The p.11 heading about altered quotations is **not by itself proof of unchanged quotations**. The official Q60's quotation evidence plus p.7's prior-information access supply the relevant basic support; the exact copied exchange in this new case is a stated finding.
- The setting's exact type is unspecified. Do not invent a forwarding rule, read-state manipulation, notification suppression, or a proven exfiltration path in the later explanation.

### B020 — browser warning and evidence limits

- It is a confirmed fake **web-page** warning, not merely a negative antivirus result.
- Copyable logos, urgency, a supplied phone/chat contact, or absence of malware detections do not make that contact trustworthy.
- The case explicitly excludes installing tools, granting remote access, and paying; it does not require pretending those actions are harmless after they occur.
- The Esc/browser-close method is confirmed for this PC. IPA's v1.00 procedure acknowledges environment differences; the candidate does not promise universal keyboard behavior.
- The correct option uses the internally confirmed method and internal reporting, not buttons or contacts controlled by the warning.
- Optional teaching follow-up, not a required question change: the cited procedure p.6 also says not to restore the warning page when restarting the browser.

## Calibration and limitations

- All 20 currently have one defensible answer; no required numerical, permission-column, timestamp, or source-version correction was found.
- A011's overseas wording, A016's explicit limits on non-DX examples, and B020's explicit fake-warning finding make their distinctions somewhat easier. These are non-blocking for basic study items: the official-format task and central reasoning remain. If higher discrimination is desired, shorten redundant cues without removing the premises necessary for a unique answer.
- JIS full text and the original METI DX Report 2 were not independently fetched. A001 stays within the official question's basic concept; A016 explicitly cites the IPA-presented definition table, which was checked directly.
- No live web retrieval was performed. Resource statements refer to the cataloged local versions actually inspected.
- No application/browser rendering test was performed. B018's structural semantics were checked by span expansion and source PDF coordinates, not by a visual UI screenshot.
- Do not run the author validator or full corpus pipeline under this review's blind-access restrictions: they may read prohibited candidate answers. Validation is confined to the two review JSONs, the blind packet, and permitted sources.
