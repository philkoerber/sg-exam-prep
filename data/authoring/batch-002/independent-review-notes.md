# Batch 002 — independent initial review

## Result and scope

- Exactly **20** blind candidates reviewed: **6 accept / 14 revise**.
- Accepted suffixes: **001, 005, 011, 013, 015, 019**.
- Revise suffixes: **002, 003, 004, 006, 007, 008, 009, 010, 012, 014, 016, 017, 018, 020**.
- These are review verdicts, not publication approvals. No author JSON, approval state, or publication data was changed.
- Per-choice assessments, source reasoning, and necessary fixes are in `independent-review-initial.json`. Combination questions assess the constituent proposals and account for every offered combination.

## Independence and ordering

1. Read/projected only `blind-review.json` question bodies, choices, tables, diagram paths/texts, IDs, and supplied content hashes for the solves. The initial file-outline call exposed field names and line ranges, not reference contents or answers.
2. Solved all 20 and wrote `independent-answers.json` **before** opening the resource catalog, official question files, official PDFs, or source-reference contents.
3. Verified that the saved answers contain exactly the same 20 IDs/content hashes, in order, as the blind candidates.
4. Recorded the pre-source answer file SHA-256:
   `0e6e87a3da4ff6862608c9aa4041aa06ed7337f4165390ca979cb7c08cc7e250`.
5. Only then read the citations, cataloged primary-resource copies, official anchor JSON, question PDFs, and official answer PDFs. Saved independent answers were not changed after this lookup.
6. Inspected the requested `BlindReview` type at `scripts/validate-pilot.ts:20–27`. Did not run the author validation pipeline or inspect expected generated answers.

No contents of author `questions.json`, `reviews.json`, `REVIEW.md`, `check.ts`, language reports/notes, rendering scratch files, previews, or generated output were opened. A directory listing was used solely to verify the output directory and that the three review output filenames did not already exist. “Commit” here is the persisted pre-source answer record and its digest; no Git commit or Git metadata modification was made.

## Review standard

A unique, easy-to-identify answer is not sufficient for acceptance. I separately checked correctness, each distractor, substantive anchor alignment, source/version limits, Japanese, and whether a purported new case requires more than substituting names or paraphrasing the original.

All 20 have a genuine conceptual connection to their cited anchor; I found no candidate whose only connection is the visual style of an official question. However, many repeat the original decision and almost the same choice roles. The novelty findings below do **not** allege a wrong answer or a mismatched subject. They request a materially different application of the same objective.

This is not a demand to make every question harder. Short definition and calculation questions can be appropriate. The accepted A questions make a concrete classification/application or test another intervention within the original objective. In particular, 013 is a modest quantitative variant, not a substantial case study; its repair-time intervention and explicit positive-time assumptions still support an independently checkable question. Ordinary words must not be replaced by rare kanji to manufacture difficulty.

## Anchor comparison and required action

PDF page numbers below are physical PDF page numbers.

| Suffix | Official anchor and question PDF pages | Objective actually compared | Verdict / necessary action |
|---|---|---|---|
| 001 | 2024 Q1, p.2 | Risk identification/analysis/evaluation versus treatment | Accept: concrete work items apply the same process boundary. |
| 002 | 2024 Q2, p.2 | Labelling connects information to known handling rules | Revise: same denial/label story; make new facts matter and replace availability-only distractors. |
| 003 | 2022 sample Q12, p.5 | Rootkit concealment versus other security tools | Revise: near-identical function comparison; add new observations and fix `外部から応答する`. |
| 004 | 2023 Q7, p.5 | Match Web threats to controls | Revise: product-search context does no work; search-result limits and daily backups are weak competing controls. |
| 005 | 2025 Q6, p.4 | CVSS v3 temporal versus base/environmental metrics | Accept: concrete vendor confirmation/fix events versus local requirements. |
| 006 | 2022 sample Q25, p.11 | Human/bot discrimination versus authentication and SQL protection | Revise: largely the same definitions; use a genuinely different operational case. |
| 007 | 2022 sample Q30, p.12 | External port/service discovery versus audit/log/content inspection | Revise: the same four roles paraphrased; introduce observations that require identifying the tool's capability. |
| 008 | 2023 Q2, p.2 | History-dependent anti-passback | Revise: the original re-entry definition with a person's name; use actual differing event histories. |
| 009 | 2023 Q4, p.3 | Symmetric/asymmetric suitability for bulk encryption | Revise: original correct proposition moved into the stem; give the new requirements a role and improve comparisons. |
| 010 | 2022 sample Q31, p.13 | Necessary scope of specific-personal-information files | Revise: same performance/check/backup cases; version refresh is valid but not a new case. |
| 011 | 2023 Q8, p.5 | Legal evidentiary effect of electronic signatures | Accept: statutory conditions and limits of the effect, not merely generic electronic-signature features. |
| 012 | 2022 sample Q39, p.15 | Incident versus detection, cause, and recovery | Revise: same failure/detection/recovery/later-fix sequence with swapped domain and timing. |
| 013 | 2024 Q9, p.5 | Availability as a function of MTBF and MTTR | Accept: every alternative can be checked algebraically; positive values prevent degenerate cases. |
| 014 | 2023 Q10, p.6 | Cookie storage and request-header transport | Revise: three original propositions recur; a lifecycle preamble alone is not a new case. |
| 015 | 2024 Q8, p.4 | Embedded control activity versus risk assessment and monitoring | Accept: concrete payment-to-approved-order reconciliation instantiates the original control-activity objective. |
| 016 | 2023 Q12, p.7; supplemental 2024 Q12, p.6 | Cause-and-effect diagram versus other quality-control diagrams | Revise: same fish-bone giveaway and same four diagram names; use a real analysis purpose. |
| 017 | 2022 sample Q51, pp.24–25 | Close a nonstandard-software patch-management gap | Revise: same gap and same five proposal roles; also scope the evaluation definition to each row. |
| 018 | 2022 sample Q53, pp.28–29 | Employee tailgating and suitable behavioral controls | Revise: clarify actual room-to-room route and individual versus common-design employee badges. |
| 019 | 2022 sample Q57, pp.36–37 | Evidence-based self-assessment versus the mere existence of rules | Accept: actual excessive rights reverse the original compliant finding and require an NG judgment. |
| 020 | 2025 Q15, pp.12–14 | Choose anonymization methods from privacy and utility constraints | Revise language only: explicitly state that L creates the anonymous information and M receives it. Changed rounding requirements are substantive and defensible under the stated assumptions. |

## Primary-resource and version checks

All **17 distinct cited resource files** matched the SHA-256 values in `data/resources/catalog.json`. These were local cataloged primary-source copies; I did not independently re-download live websites or certify the current state of the law beyond the versions stated in the questions.

- **Official anchors:** examined the actual question PDF passages for all 20, the supplemental 2024 Q12, and the four official answer PDFs. Historical keys were used only after answer preservation and only to corroborate historical anchors, not to supply candidate keys.
- **SQL:** IPA `sql.html`, 1-(i)-a, supports placeholders, binding, and the separation of SQL structure from input values. The candidate refers to values, not arbitrary identifiers. This supports 004 and the SQL distractor distinction in 006.
- **CVSS:** IPA `cvss3.html`, 1.1, 2.2.2 RL, 2.2.3 RC, and 2.3.1, distinguishes temporal events from environmental security requirements. The cited document is v3.0, which is within the question's v3 scope; no v4 metric terminology was substituted.
- **My Number:** the saved guideline actually displays `令和７年６月一部改正`; section 第4-1-(2) limits file creation to necessary statutory work and expressly rejects sales-performance management. The fixed Q&A PDF actually displays `令和７年４月１日更新`; PDF pp.19–20, Q2-1/A2-1, supports within-scope reconciliation and backups with safeguards. Did not use the moving HTML FAQ as proof of the fixed 2025 version.
- **Electronic signature:** the official XML's main-provision Articles 2 and 3 support the definition and presumption of authentic establishment. The applicable Article 3 was distinguished from similarly numbered supplementary provisions. Content truth, government endorsement, and a blanket waiver of author verification do not follow.
- **Cryptography:** NIST SP 800-12 Rev.1 PDF pp.62–63 and 65 support corresponding private keys and key protection/lifecycle. They are not cited as if those particular passages directly establish a general speed benchmark. The bulk-encryption comparison is present in official 2023 Q4 and its answer.
- **Cookies:** RFC 6265 §§1, 3, 3.1, 4.2 and 8.3 support browser/user-agent storage, the subsequent Cookie request header, and the lack of cookie-level automatic encryption. The explicit send-condition premise avoids assuming every stored cookie is always sent.
- **SME guideline v4.0:** PDF pp.22–23 use **six** security principles, unlike the historical five-principle 2022 case. 017 uses a company-defined assessment instead of incorrectly relabelling the current framework. PDF p.36 supports patching and disabling unnecessary software; pp.33–34 support least privilege and physical boundary controls; p.39 supports evidence inspection, interviews, and observation. These general passages do not prove candidate-specific tool capabilities or floor-plan routes; those must be explicit case facts.
- **Anonymization:** PPC second edition, May 2022 update, title/version checked. PDF p.74 requires consideration of the database's properties and accumulated information; pp.80–81 define the techniques; pp.82–84 explicitly limit the examples and describe identification/contact risks. 020 supplies a single-day case, removal of the date, replacement of the linking code, a whole-data assessment, and an explicit limit on legal-compliance claims. It is therefore not asserting that exact central-range step counts or broad industries are universally safe without processing. Preserving central values rather than rounding materially changes the historical case's technique selection.

## Actual B structures, not just labels

### 017

The blind table has three columns, one header row, and two target rows. The intended branch is readable, but `全PCで利用する全てのソフトウェア` defines an overall state whereas the first row is already labelled implemented even though added software remains unpatched. Define implementation relative to each row's target, then separately ask whether all targets meet it.

The tool-coverage, available-patch, removable-software, and continued-existing-management premises remove several possible ambiguities. They mostly make the original case explicit; they do not themselves provide a changed case.

### 018 — path-level inspection

Inspected the blind JSON's **five path definitions and eight text objects**, not an author's SVG, PNG, HTML preview, or render script. No image was written or claimed to have been rendered.

- Outer rectangle: x=20..620, y=20..320 within a 640×345 viewBox.
- Horizontal boundary y=170 has openings x=115..175 and x=410..470.
- Upper vertical boundary x=310 separates the two upper rooms.
- Lower vertical boundary x=310 has opening y=230..285.
- Labels and door-leaf strokes identify the openings as P, Q, and R respectively.

The resulting adjacency is:

| Door | Side 1 | Side 2 |
|---|---|---|
| P | 顧客管理部エリア, upper left | 共用エリア, lower left |
| Q | 共用の作業室, upper right | 受付・来客用会議室, lower right |
| R | 共用エリア, lower left | 受付・来客用会議室, lower right |

Thus only P is the protected department's entrance. However, employees going from the common area to the shared workroom must go through R and the reception/visitor room before Q. The current sentence can suggest direct access from the common area to both upper rooms. This is a clarity defect, not a claim that the intended answer cannot be recovered. Either explicitly describe that indirect route or draw the intended different adjacency. The different fixes are alternatives, not a request to redesign the whole office.

The identical-employee-badge wording is separately ambiguous. Say that each employee carries their own badge with a common design lacking department/authority information if that is the intended premise.

The door labels, area labels, and openings are within the viewBox and distinguishable from the coordinate data. This review does not claim browser/font rendering validation.

### 019

The panel contains the full four-way rule, the three-column table supplies the evaluation item and placeholder, and the choices supply result/reason pairs. This supports an actual evidence-based assessment rather than a decorative table. The official JSON's flattened choice text for historical Q57 contains extraction artifacts; the intact structured table and the actual PDF pp.36–37 were used to resolve that source representation, without changing it.

### 020

The two linked three-column data tables and the three-column methods table have coherent IDs and sample data; the choice table supplies all three requested fields. No inference is made from the four displayed records to the whole population: the text explicitly identifies excerpts and supplies the risk/utility assumptions. The low and high steps illustrate the prescribed bins while the central values illustrate why rounding loses required information.

The first paragraph's attachment of `匿名加工情報を作成して商品を販売する` to `M社` can assign creation to the wrong entity. That is a necessary, small Japanese fix, not a reason to discard the otherwise substantive changed case.

## Japanese and necessary terminology

Assessed the blind text directly, without reading language-author notes or treating an unfamiliar kanji as automatically justified. Technical/legal terms such as `脆弱性`, `可用性`, `真正`, `源泉徴収票`, `共連れ`, and `匿名加工情報` have ordinary, necessary subject-specific contexts here. No candidate needs obscure synonyms to become more demanding.

Required language/precision changes are local: 003's direction of port responses, 017's scope of its evaluation definition, 018's movement description and badge wording, and 020's processing/provider subject. The other revision requests concern case substance or distractor quality, not a general objection to the level of Japanese.

## Validation boundary

Use only a standalone read-only structural check of the blind input and the two independent JSON outputs: exact count and ID coverage, supplied content-hash equality, legal answer labels, `BlindReview` fields/types, nonempty issues on revisions, reason length, answer consistency, and preservation of the pre-source file digest. Do not run the project's author-key-dependent checks to validate this independent review.
