# Next question batch: historically anchored practice

Planning snapshot: **2026-10-10, before implementation**. The plan below is retained as the original proposal.

**Implementation update (2026-10-10):** both 20-question waves are now authored, independently AI-reviewed, revised and published as [batch-002](batch-002/REVIEW.md) and [batch-003](batch-003/REVIEW.md). The existing pilot was deliberately left unchanged/unpublished rather than blocking the separately requested new batches; the active bank is therefore **160**, not the conditional 210 below. Supporting resources were archived where needed; unchanged facts also use exact official question/key evidence. Full JIS text and a separate METI DX Report 2 were not acquired. B03 used the intact source PDF/table without changing the original malformed flattened choices. These scope decisions and source limits are explicit in the batch review records. No new benchmark variants were published.

## Decision in brief

Propose **40 additional study questions: 32 A + 8 B**, one variant for each of 40 different official families that have no assigned pilot variant. Work in two reviewable waves of **16 A + 4 B**, not one unchecked generation run.

First complete the concept/source audit and independent review of the existing 50 drafts. Recheck this selection if that work changes family assignments. The active bank remains **120 official + 0 generated** until publication gates pass.

- [Coverage map](coverage-map.md): all 111 official families, their objectives, assigned drafts, reference-only citations, and resource coverage.
- [Existing authoring rules](README.md): content shape, review records, language screening and publication gates.
- [Pilot status](pilot-001/REVIEW.md): the existing 50 are drafts, not independently approved content.

The governing rule for this batch is stricter than the existing permission to use format-only references:

> An official question supplies the tested concept AND the reasoning task. The syllabus bounds scope. A factual source supports the answer. A familiar layout or shared keyword alone is not sufficient historical grounding.

## What the expansion would accomplish

| Measure | Current official bank | With all 50 pilot drafts approved | With pilot + proposed 40 approved |
|---|---:|---:|---:|
| Total questions | 120 | 170 | 210 |
| A / B questions | 96 / 24 | 136 / 34 | 168 / 42 |
| Study / benchmark questions | 105 / 15 | 151 / 19 | 191 / 19 |
| Distinct families, all pools | 111 | 113 | 113 |
| Official study families with generated variants | 0 published | 44 | 84 |

These are conditional counts, not publication promises. The pilot already assigns drafts to 48 official families, including four benchmark families; its other two families are pilot-only. There are **52 unassigned study families (42 A / 10 B)**. This proposal uses 40 and leaves 12 explicitly deferred below.

The objective is **less verbatim repetition across the same exam-tested concepts**, not inventing more concepts or claiming 40 new families. Family-first sampling remains unchanged: one member per family per session, no extra sampling weight for large variant families, and no cross-session unseen-question guarantee. Law practice would still have the same family count; it would gain alternative questions within those families.

All proposed questions retain their anchor's subject and family and use `pool: "study"`. No 2026 benchmark question may be used as a primary anchor, secondary format reference, or source of a close scenario variant. Merely citing a study question alongside a benchmark question is not an acceptable way around that restriction.

## Selection and ID notation

- `22Snn` means `sg-2022-sample-nn`; `23Pnn`, `24Pnn`, `25Pnn` mean `sg-2023-public-nn`, `sg-2024-public-nn`, `sg-2025-public-nn` respectively. Keep leading zeros.
- `A01`–`A32` and `B01`–`B08` below are **planning slots**, not new corpus IDs.
- Each selected family equals its anchor ID **except A16**, which uses `familyId: "cause-effect-diagram"`. Its official members are `23P12` and `24P12`, not two separate opportunities.
- All 40 selected anchors are study-only and have neither an assigned pilot variant nor a pilot reference-only citation. This does not mean their broader topics are absent from the pilot.
- Topic tags are retained as stored, not asserted to be IPA metadata. In particular, `22S53` is tagged `law` but tests **physical tailgating prevention**, not a statutory-law rule.

### Proposed allocation by stored topic

| Topic | A | B | Total |
|---|---:|---:|---:|
| management | 3 | 2 | 5 |
| threats | 5 | 3 | 8 |
| technology | 7 | 0 | 7 |
| operations | 4 | 1 | 5 |
| law | 3 | 2 | 5 |
| it | 10 | 0 | 10 |
| **Total** | **32** | **8** | **40** |

This is a gap-filling allocation, **not an official topic weighting or a new mock-exam quota**. Ten related-IT questions help cover previously unvaried official objectives; they should not turn into advanced FE-style questions. Four of the five law-tagged proposals actually concern statutory concepts; B02 is physical security.

## Source status key

Every slot also has its official question and official answer PDF as primary anchor evidence. The reference names below identify additional factual checks, not invented catalogue resource IDs.

- **L — local section inspected:** an existing file in `../resources/catalog.json`; cited page numbers are **1-based PDF pages**, not printed page numbers. This is not verification of upstream legal currency or every prospective distractor.
- **V — official source verified online:** title/content or relevant section inspected during planning, but **not yet archived, checksummed or registered**. Exact passages and applicability must be recorded before approval.
- **P — pending:** a specific factual-source requirement, not a verified citation. Do not fill the gap with a syllabus-only citation.

### Existing local support

| Short name | Catalogue ID | Verified scope and limits |
|---|---|---|
| SME | `ipa-sme-4.0` | PDF p. 33: minimum necessary rights and privilege concentration; p. 34: physical access; p. 36: updates, signatures and unnecessary software; p. 39: evidence-based checks. These passages do not prove every audit/technical assertion. |
| CLOUD | `ipa-cloud-4.0` | PDF p. 6: limiting users and an example of supervisory approval authority. Exact company roles must be case premises. |
| INCIDENT | `ipa-incident-4.0` | PDF pp. 3–4: recurrence prevention and response, including updating definitions before checking other systems. Verify specific reporting/escalation passages separately for A24. |
| PPC-GENERAL | `ppc-general` | PDF pp. 29–30 and 158–160: anonymisation definition and statutory processing requirements; pp. 180–182: education and handling-area controls. Not a substitute for specialist My Number or anonymisation-method guidance. |
| SYLLABUS | `ipa-sg-syllabus-4.1` | Scope only. Keep the official-only language baseline fixed; a listed term is not answer proof. |

### Verified online additions to archive before use

| Short name | Official source | Relationship to original exam / required check |
|---|---|---|
| CRYPTREC (V) | [CRYPTRECとは](https://www.cryptrec.go.jp/about.html) | A20 names the organisation, not this webpage. Page supports its evaluation/monitoring role for electronic-government recommended cryptography. |
| MY-NUMBER (V) | PPC [business guidelines, file-creation restrictions](https://www.ppc.go.jp/legal/policy/my_number_guideline_jigyosha/#a4-1-2) and [Q&A, Q2-1](https://www.ppc.go.jp/legal/policy/faq/) | Original A10 explicitly cites the March-2022 guideline and 1-April-2022 Q&A. Current entry pages verified; **those exact historical snapshots are not**. Select and record the applicable edition. |
| PENAL (V) | e-Gov [刑法, official XML](https://laws.e-gov.go.jp/api/1/lawdata/140AC0000000045), Article 234-2 | Supporting statute for A25. Current wording is not the 2022 snapshot; avoid importing updated penalty wording or turning a classification task into legal advice. |
| SQL (V) | IPA [安全なウェブサイトの作り方 — 1.1 SQLインジェクション](https://www.ipa.go.jp/security/vuln/websecurity/sql.html), 根本的解決 1-(i)-a | Not explicitly cited by A04's original. Direct support for placeholders and binding; implementation assumptions still need review. |
| E-SIGN (V) | e-Gov [電子署名及び認証業務に関する法律, official XML](https://laws.e-gov.go.jp/api/1/lawdata/412AC0000000102), Article 3 | A11 names the statute. The rule is a **conditional presumption of authentic creation**, not unconditional equivalence for every electronic signature. Include the relevant conditions. |
| CVSS3 (V) | IPA [共通脆弱性評価システムCVSS v3概説](https://www.ipa.go.jp/security/vuln/scap/cvssv3.html), §§1.1 and 2.2 | Supports A05's Temporal metrics, E/RL/RC. The page identifies a v3.0 basis. Preserve the anchor's v3 scope; do not silently substitute v4 metrics. |
| FAKE-ALERT (V) | IPA [偽セキュリティ警告（サポート詐欺）対策特集ページ](https://www.ipa.go.jp/security/anshin/measures/fakealert.html) | Background for B08, not an explicit original citation. Preserve the no-installation/no-remote-access state for the browser-closing response. |
| BEC (V) | IPA [ビジネスメール詐欺（BEC）対策特設ページ](https://www.ipa.go.jp/security/bec/about.html) | Entry page and countermeasure material verified. Before B05 approval, pin the specific case passages supporting lookalike identities and abuse of genuine correspondence; the landing page alone is not proof of every classification. |
| ANON (V) | PPC Secretariat [仮名加工情報・匿名加工情報 信頼ある個人情報の利活用に向けて―制度編―, 第2版](https://www.ppc.go.jp/files/pdf/report_office_seido2205.pdf) | **Explicitly cited in B04's original method table.** Cover verified as March 2022, updated May 2022. Pin the exact method/examples pages; this is not the general PPC guideline already archived. |
| INSIDER (V) | IPA [組織における内部不正防止ガイドライン, 第5版](https://www.ipa.go.jp/security/guide/insider.html) | Edition/official page verified in the preceding overview. Explicitly connected to SG by IPA's exam outline; useful for A02 and pilot repair. Exact labelling, conduct and access-control passages still need inspection and archival. |

**Not yet externally verified:** METI's **DXレポート2** is explicitly named by A32's original, which also includes its stage definitions. Attempts to retrieve the report page/PDF returned HTTP 403 / page-not-found content. Treat external retrieval as blocked, not verified; do not substitute DX Report 2.1 or 2.2 without checking scope.

**Other pending source tasks:** locate and inspect appropriate primary material for JIS Q 31000:2019 process definitions, rootkits, ordinary HTTP-port usage, CAPTCHA, port scanning, anti-passback, symmetric/public-key performance, IT-service incident terminology, availability, cookie handling, internal control, quality-control diagrams, cyber kill chains, VDI isolation, zero trust, testing/audit, stakeholder/CSR benefits, BPM, RPA and data marts. These are requirements in the slots below, not claims that the existing SME guide covers them. Official anchors/keys support the original questions; changed general claims need their own support. Do not obtain standards from unauthorised copies or assume a general guideline reproduces an exact JIS definition.

## Wave 1 — 16 A questions

Prioritise everyday controls, the missing substantive law objective, and varied reasoning formats. V/P references remain work items: priority does not mean publication-ready.

| Slot | Official anchor | Preserve this objective; meaningful variation | Additional factual support / boundary |
|---|---|---|---|
| A01 | 24P01 | **リスクアセスメント:** distinguish identification, analysis and evaluation from treatment/acceptance. Change the described activities and candidate groupings, not just their order. | P: JIS Q 31000:2019 process definitions; SME is contextual only. Distinct from pilot risk-level calculation. |
| A02 | 24P02 | **情報のラベル付け:** make the handling category recognisable so a user cannot plausibly claim ignorance. Change the document/channel and stated handling rule; distinguish notice from access restriction. | INSIDER (V; exact section pending). Do not turn this into a generic least-privilege item. |
| A03 | 22S12 | **ルートキット:** recognise concealment of malicious tools/activity, versus scanning or defensive checking. Change observed symptoms and the competing explanations. | P: primary rootkit definition. Do not add advanced kernel internals or imply only kernel-mode concealment counts. |
| A04 | 23P07 | **SQLインジェクション対策:** match parameter binding/placeholders to the correct threat. Change the application operation and mismatched countermeasures. | SQL (V). Preserve threat–control matching rather than write an exploit or test SQL syntax. |
| A05 | 25P06 | **CVSSv3 現状評価基準:** distinguish time-varying exploit/remediation/report conditions from intrinsic and organisation-specific factors. Change which facts become available. | CVSS3 (V). No v4 terminology or score calculation. |
| A06 | 22S25 | **CAPTCHA:** distinguish human-versus-automated interaction checks from user-identity authentication and injection prevention. Change the service action and offered mechanisms. | P: primary CAPTCHA description. Avoid guarantees that automated access can always be excluded. |
| A07 | 22S30 | **ポートスキャナ:** identify reachable service endpoints/unnecessary exposed services rather than audit accounts, logs or page content. Change the stated inspection objective and evidence. | P: primary port-scanning guidance; SME p. 36 gives general unnecessary-software context only. A port alone does not prove a particular service/version. |
| A08 | 23P02 | **アンチパスバック:** apply the consistency of entry/exit authentication history. Change the card-use sequence and distinguish interlock/occupancy/emergency-opening controls. | P: authoritative anti-passback definition. Keep a short A scenario, not B02's tailgating case. |
| A09 | 23P04 | **共通鍵暗号と公開鍵暗号:** choose the suitable method for bulk-data encryption, versus the role of key establishment/signatures. Change workload and proposed explanations. | P: primary cryptographic guidance. Avoid claims that all public-key schemes rely on factorisation or all symmetric keys are reused. |
| A10 | 22S31 | **特定個人情報ファイルの作成制限:** distinguish permitted administrative/supporting files from unrelated employee-performance use of My Number. Change file purpose and the necessity conditions. | MY-NUMBER (V; edition resolution required). General personal-information guidance is insufficient. |
| A11 | 23P08 | **電子署名法の効力:** recognise the conditional legal presumption for qualifying electronic records/signatures. Change the record and key-control facts while preserving the statutory distinction. | E-SIGN (V), Article 3. Do not say every electronic signature automatically has identical legal effect. |
| A12 | 22S39 | **インシデントの識別:** distinguish service interruption from its underlying defect, detection and recovery action. Change the failed business operation and sequence. | P: IT-service incident/problem definitions; INCIDENT is security-response context, not a complete ITSM terminology source. |
| A13 | 24P09 | **可用性:** compare MTBF/MTTR changes and their effect on availability. Change values or multipliers so old answer-position memory fails. | P: verify availability definition; then independently recompute every option from MTBF / (MTBF + MTTR). Keep units/assumptions explicit. |
| A14 | 23P10 | **HTTP cookie:** distinguish header-based exchange and browser/server roles from encryption/storage misconceptions. Change the described exchange. | P: primary HTTP cookie specification. Do not generalise that client-side scripts can never create cookies or that all cookies are encrypted. |
| A15 | 24P08 | **内部統制の統制活動:** identify a check embedded in a business process rather than overall strategy, risk analysis or separate monitoring. Change the transaction and control action. | P: current primary internal-control framework, with version recorded. Keep this separate from B03's evidence assessment. |
| A16 | 23P12 | **特性要因図:** identify a cause–effect organising method rather than frequency/priority/time-variation charts. Change the quality problem and descriptions, preserving the short recognition task. | P: primary quality-control definitions. Family is `cause-effect-diagram`; 24P12 is the same family, not an extra slot. No obligatory invented diagram—the original is text-only. |

## Wave 1 — 4 B cases

### B01 — `22S51`: close the unmanaged-software update gap

- **Preserve:** the distinction between software already covered by update management and software outside it; select measures that close the actual gap, not monitoring-only measures or repetition of existing rules.
- **Change:** the unmanaged applications/endpoints and the explicitly stated coverage of proposed tools. Each chosen measure must independently address the gap under the new facts.
- **Shape:** assessment table, managed/unmanaged narrative, five proposed measures and ten pair-combination choices; comparable two-page-source reading load.
- **Support:** SME (L), PDF pp. 22–23 and 36. Tool capabilities are explicit case premises, not properties assumed from a product category.
- **Version check:** the 2022 source says SECURITY ACTION **5か条**; the cached v4.0 guide says **6か条**. Use verified current wording or explicitly date a historical scenario. Do not silently mix editions. Keep the objective separate from pilot D048's decision about additional vulnerability assessment.

### B02 — `22S53`: prevent employee tailgating across a restricted boundary

- **Preserve:** distinguish measures that address an employee following an authorised entrant from stronger card authentication or controls aimed at external visitors.
- **Change:** the restricted area, relevant doorway and permitted movements, so interpreting the layout changes which measures fit.
- **Shape:** selectable-label **vector floor plan**, seven proposed measures and ten pair-combination choices. The diagram must remain necessary to solving the case.
- **Support:** SME (L), PDF p. 34; PPC-GENERAL (L), PDF pp. 180–182, for area management and education. Precise effects of cameras/badges/door controls require explicit premises or further evidence.
- **Boundary:** tagged `law`, but this is physical security, not an additional legal doctrine. Do not import the 2026 visitor-pass case. Do not generalise that CCTV or stronger authentication is useless.

### B03 — `22S57`: match a self-assessment result to observed evidence

- **Preserve:** actual implementation evidence versus mere policy existence, with case-defined outcomes `OK`, `(OK)`, `NG`, `NA`.
- **Change:** which evidence was observed and which control is assessed; make the result/rationale pair depend on those facts.
- **Shape:** four-outcome rule panel, assessment-sheet excerpt and four-row result/rationale choice table. Keep one focal control rather than expanding into a broad audit.
- **Support:** SME (L), PDF pp. 33 and 39. Outcome labels are the organisation's rules, not an IPA-mandated universal scale.
- **Source blocker:** the canonical `choices[].text` for the original contains a split/merged extraction defect (part of イ is in ア; イ is `OKた。`). The structured table and source PDF p. 37 contain the intact alternatives. Resolve and verify this in a separate targeted data-maintenance change before using flattened choices or a text-length baseline; **this planning task does not modify the original**.
- **Neighbour check:** distinguish this from pilot D024's audit topic and benchmark D028's follow-up; do not use those as borrowed case material.

### B04 — `25P15`: anonymise data without destroying the specified analysis

- **Preserve:** choose a combination for a direct identifier, useful categorical attribute and numerical measure; balance disclosure risk against the expressly required analysis.
- **Change:** the analytical objective, field values, extreme observations and required precision so the transformation combination must be reasoned through again.
- **Shape:** two linked datasets, a method-explanation table and a ten-row three-field answer matrix; comparable three-page-source reading load.
- **Support:** ANON (V), the exact Secretariat report cited by the original; PPC-GENERAL (L), PDF pp. 29–30 and 158–160. Inspect and pin method pages before drafting.
- **Legal gate:** neither deleting email alone nor rounding alone establishes legal compliance. Retaining industry or applying both top/bottom coding and rounding is not a universal rule. Record the applicable legal date and ensure one defensible combination. This is the batch's missing substantive B-law objective, unlike B02.

## Wave 2 — 16 A questions

| Slot | Official anchor | Preserve this objective; meaningful variation | Additional factual support / boundary |
|---|---|---|---|
| A17 | 25P01 | **リスク分析:** distinguish understanding risk nature/level from identifying risks, evaluating acceptability and selecting treatment. Change the described activity and competing process labels. | P: JIS Q 31000:2019 process definitions. Distinct from A01's assessment-component grouping and the pilot's risk calculation. |
| A18 | 22S15 | **通常のWeb通信と指令通信:** infer why outbound TCP/80 may pass ordinary web-access rules. Change the explicit permitted-service conditions and explanations. | P: primary HTTP port and command-channel guidance. A permitted port does not make traffic benign or undetectable. Keep HTTP/HTTPS distinctions precise. |
| A19 | 24P04 | **サイバーキルチェーン:** recognise attacker-stage organisation from reconnaissance to objectives, versus unrelated chain/interception concepts. Change the incident description used to identify the model. | P: primary model description. Do not require advanced phase naming absent from the original. |
| A20 | 22S07 | **CRYPTRECの役割:** distinguish cryptographic evaluation/monitoring from product certification, export approval and operational attack monitoring. Change the request/task assigned to an organisation. | CRYPTREC (V). Keep this a role question, not selection of newly introduced algorithms. |
| A21 | 22S09 | **VDIによるブラウザ分離:** infer the limited effect of moving browsing to a DMZ-hosted desktop instead of claiming universal endpoint protection. Change the browsing location and explicitly disable file transfer paths if needed. | P: primary isolation/VDI guidance. State clipboard/download/drive-redirection assumptions; do not assume all VDI products isolate files automatically. |
| A22 | 25P03 | **ゼロトラスト:** distinguish not automatically trusting internal-network access from zero-day, zero-knowledge and behavioural-detection concepts. Change the internal-access situation. | P: primary zero-trust definition. No new product architecture or specialist protocol terminology. |
| A23 | 22S35 | **システムテスト監査:** judge test-case coverage against the stated system scope, instead of assuming user-only approval/execution or mandatory production testing. Change the test plan facts. | P: primary testing/audit criteria. Do not replace this with audit independence or general security-control review. |
| A24 | 23P09 | **インシデント管理の監査:** identify inadequate escalation/reporting design for different incident circumstances. Change affected services, impact and routing conditions. | INCIDENT (L; exact escalation section still to locate), plus P audit criteria. A common intake channel alone is not necessarily a defect; preserve the substantive failure to route appropriately. |
| A25 | 22S32 | **刑法とコンピュータ業務妨害:** classify media-delivered destructive interference under the appropriate statute, versus unrelated legal regimes. Change the business/data disruption facts, not penalty trivia. | PENAL (V), Article 234-2. The original has an older law-name distractor; verify current nomenclature or explicitly date it rather than silently reproducing obsolete terminology. |
| A26 | 22S37 | **内部統制の最終責任:** distinguish management's responsibility from execution, monitoring and ownership roles. Change delegation facts while retaining the listed-company context. | P: primary internal-control framework; same verified edition as A15 where appropriate. Delegation of tasks must not be confused with transfer of ultimate responsibility. |
| A27 | 22S46 | **ステークホルダ:** identify who benefits directly from local employment/environmental measures rather than from unrelated commercial relationships. Change the measures and their recipients. | P: primary stakeholder/CSR definitions; make beneficiaries explicit in the case. Avoid subjective claims about who benefits most overall. |
| A28 | 22S48 | **売上総利益:** derive manufacturing cost/cost of sales and gross profit from the displayed statements. Change figures and opening/closing inventories coherently. | Official statements/key plus independent arithmetic for every option; P accounting definitions for any changed rule. Retain both native tables and meaningful blank fields; no mere isolated formula question. |
| A29 | 23P11 | **BPM:** distinguish ongoing process analysis/design/execution/improvement from ERP, CRM and supply-chain integration. Change the business initiative being described. | P: primary BPM definitions. Keep the cyclic improvement objective, not generic automation. |
| A30 | 24P11 | **RPA導入:** choose cross-department process visibility/review before automation, versus isolated or exception-heavy deployment. Change rollout circumstances and proposed priorities. | P: authoritative public RPA/process-improvement guidance. Do not assert absolute rules about every RPA implementation. |
| A31 | 25P11 | **データマート:** identify an analysis-specific dataset derived from an integrated warehouse, versus catalogue, lineage and lake. Change the required analysis and data preparation. | P: primary data-management definitions. Preserve the short identification task, not SQL/database design. |
| A32 | 25P12 | **DXの段階:** distinguish enterprise/business-model transformation from digitisation or optimisation of an existing process. Change the manufacturing/business-network example. | P: external retrieval of the explicitly cited **DXレポート2** is blocked. Preserve its three-stage definition table and verify the report before claiming source-backed readiness. No substitution with a later report by title alone. |

## Wave 2 — 4 B cases

### B05 — `22S60`: identify what made a fraudulent business email look credible

- **Preserve:** distinguish apparent legitimacy from warning signs; select three relevant findings rather than merely name BEC.
- **Change:** the document history, apparent sender identity and quoted correspondence, while making each evidential role explicit.
- **Shape:** seven numbered investigation findings plus the separate compromise finding; ten three-number-combination choices, comparable one-page-source density.
- **Support:** BEC (V), with exact impersonation/correspondence case passages to archive. General incident guidance alone does not establish each feature classification.
- **Neighbour check:** pilot D008 names BEC; this task classifies evidence. Do not infer a specific malicious forwarding rule when the original states only a concealment-related settings change.

### B06 — `22S59`: infer approval authority across an outsourcing boundary

- **Preserve:** another user approves an entry; vendor-entered work requires the client's approval; internal responsibility follows the explicit policy. Infer the role from its permissions.
- **Change:** which task is outsourced and which internal role retains final approval, so the role inference changes for substantive reasons.
- **Shape:** two-step workflow panel, existing/new policy requirements and the three-column view/input/approve rights matrix, with five role-name choices. Preserve meaningful merged headers and empty cells.
- **Support:** SME (L), PDF p. 33; CLOUD (L), PDF p. 6. The exact cross-company authority allocation is a case requirement, not a universal legal rule.
- **Neighbour check:** pilot D043 covers outsourced access scope/traceability; D047 covers operations/audit permissions. This stays about transaction authorisation and maker/approver separation.

### B07 — `23P15`: reason from signature-release and endpoint-update times

- **Preserve:** a signature exists before an attachment is opened but the endpoint has not yet installed it. Distinguish a timely effective update from rescanning with stale definitions or unrelated authentication controls.
- **Change:** release/download/opening/scheduled-update times so the proposed schedules must be checked afresh. Explicitly state connectivity, update completion and detection premises.
- **Shape:** authentication/connectivity/protection context, eleven-bullet employee-report panel, investigation result and five prose choices; comparable three-page-source reading load.
- **Support:** SME (L), PDF p. 36; INCIDENT (L), PDF pp. 3–4.
- **Boundary:** B01 tests update **coverage**; this tests **timing**. A particular ten-minute interval is not a universal IPA requirement, nor a guarantee against all infection.

### B08 — `24P15`: respond safely to a fraudulent browser warning

- **Preserve:** distinguish a webpage impersonating security software from a genuine product notification, using investigation evidence rather than logo/urgency alone.
- **Change:** the claimed authority, displayed support channel and demanded action while retaining the no-installation/no-remote-access state.
- **Shape:** employee report, boxed three-finding investigation and five prose choices. The original has no screenshot; do not add one merely for visual variety.
- **Support:** FAKE-ALERT (V), including verified safe browser-exit guidance if tested.
- **Boundary:** a clean scan alone is not proof of safety. If installation, payment or remote access has occurred, this response task changes and needs new source-backed reasoning.

## Twelve eligible families deliberately deferred

These are not rejected forever and are not spare slots that may be inserted without source review. If a selected question cannot satisfy the gates, reduce the release size or explicitly revise the plan rather than force the 40 count.

| Family / anchor | Why not in this batch |
|---|---|
| 22S04 | Exact JIS Q 27002:2014 “supporting utilities” classification: verify the named edition and how to teach current terminology without silently rewriting the old rule. |
| 22S06 | Historical NISC/organisation-establishment question: check dates and subsequent organisational naming before designing current-exam practice. Avoid an accidental current-name claim. |
| 22S11 | HDD-password protection after physical drive removal: hardware/security assumptions need tighter support before varying the scenario. |
| 22S18 | Random-subdomain DNS attack: retain for a later network-focused wave after obtaining precise resolver/cache/authority references; do not blur it into cache poisoning. |
| 23P01 | Information Security Management Standards, 2016 edition: version-specific composition/alignment statements need the exact source. |
| 23P05 | Equal SHA-256 results: do not turn the original best-answer context into a mathematical assertion that collisions are impossible. Requires careful formulation. |
| 24P06 | Already a reference-only anchor for D020. Resolve that pilot's conceptual scope before adding another certificate-validation variant. |
| 25P05 | DNS cache-poisoning countermeasure conditions need careful resolver/exposure assumptions and an authoritative source; do not generalise one configuration into complete protection. |
| 25P08 | Disciplinary-procedure audit under the 2016 management standard: exact edition plus employment-law nuance should be checked first. |
| 25P10 | RASIS metric identification is a later opportunity; A13 already adds reliability/availability practice with stronger numerical variation. |
| 24P13 | Already a reference-only anchor for D046; avoid duplication until the existing B pilot's reasoning boundaries are reviewed. |
| 24P14 | Already a reference-only anchor for D045; avoid a second closely overlapping backup case before pilot review. |

All 15 benchmark families are outside this study proposal. The older 2016–2019 archive and extra B sample are separate future work: verify scans, answers, duplication, current scope and Japanese before making them new interactive anchors. Do not claim them as newly available questions now or use OCR as verified text.

## Before authoring and publication

### 1. Resolve the pilot first

- Independently assess the 50 existing drafts; author notes are not independent approval. This plan and its source lookup are **not** a blind solve or acceptance record.
- Require concept-level anchors under the stricter policy, especially D019 and D033's format-only links, and inspect the other reference-only relationships.
- Strengthen the **34 syllabus-only** reference records where the changed reasoning needs factual support. Record the actual section, version and claims supported, not just a resource title.
- Preserve revision findings and rerun language/hash exports after edits. Recompute coverage if drafts are removed, re-anchored or assigned differently.

### 2. Prepare a small authoring packet for each selected slot

Record the expanded official anchor ID, inherited family/subject/pool, tested objective, reasoning that stays the same, circumstances that change, source section/version, displayed structure/length and foreseeable ambiguity. Separate **case premises**, **external factual claims** and **conclusions derived from the premises**. No answer or distractor should depend on unstated vendor behaviour or a law/standard from an unspecified edition.

Use the original plus answer key and verified factual passages. Change conditions that affect the reasoning, not just company names or choice order. For a simple definition/role item, use a new concrete application without turning it into a harder or broader learning objective.

### 3. Keep the Japanese and reading task close

- Retain the fixed 120-official-question vocabulary/kanji baseline; never add generated text to improve overlap. Assess new official archive material separately before any deliberate baseline change.
- Aim for **at least 95% word-token and 99% kanji overlap per question**, with batch kanji overlap at least 99% and preferably near the pilot's 99.86%. These are **proposed authoring targets**, not newly implemented validation rules or proficiency scores.
- Existing hard floors remain 90% words and 98% kanji until an explicit tooling decision. Review every unfamiliar word/kanji even above the floors; do not replace natural necessary Japanese solely to maximise a percentage.
- Use the anchor's Japanese constructions, familiar technical terms, option style and explanatory density. Compare displayed text length with the individual anchor, not only a bank-wide average. An initial **80–120% length band is a review prompt, not a mandatory padding rule**.
- Count visible body, captions, diagram labels and choices **once** when assessing reading load. Existing official text can already contain choices inside blocks; the generic concatenation helper is not automatically a deduplicated display-length measurement. Resolve B03's damaged flattened choices first.
- Preserve meaningful tables, panels, choice combinations and the B02 floor plan. A long original must not become a one-sentence keyword quiz; a short original need not become an artificial case study.

### 4. Review in two waves

For each 16 A + 4 B wave: author reasoning for every option → source/structure/language checks → answer-blind independent solve → resolve substantive findings → regenerate hashes and re-review changed questions. Check plausible distractors and all necessary assumptions, not merely agreement on the answer letter. Numerical/table questions require independent recomputation. Render desktop/mobile tables and diagrams against the source structure.

Independent AI review is not native-speaker, SG-expert or calibrated-difficulty validation. Do not claim IPA endorsement, official answers for generated items, predicted pass/fail or IRT equivalence.

### 5. Make a separate, minimal tooling change when implementation is authorised

`pilot-001` is currently hard-coded in `scripts/pilot-review.ts`, `scripts/publish-pilot.ts`, `scripts/validate-pilot.ts` and the runtime import in `src/lib/corpus/index.ts`. Before a second batch can ship, explicitly support its draft/review/publication paths and runtime import while retaining the current gates. Do not append to the existing published JSON by hand or create an unvalidated parallel bank. Keep resource PDFs and review records out of the frontend bundle.

Then run the applicable review/publish workflow, `npm run corpus:validate`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:e2e`. These are future content/publication checks; no publication or implementation command was run to create this plan.

## Planning verification and limits

Selection is checked against the current JSON for: 32 A + 8 B slots, 40 unique official study families, no assigned pilot variants, no pilot reference-only citations, topic totals and complete separation from the 12 deferred eligible families. Source verification status distinguishes local inspection, online verification and unresolved work. The coverage map documents reproducible count formulas and every original/draft relationship.

This is an authoring backlog, not 40 approved questions. Counts and source currency must be rechecked after pilot repair and before any later release.
