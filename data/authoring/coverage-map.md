# Official-family coverage map

Snapshot date: **2026-10-10, before the two new batches were authored**.

**Historical planning snapshot:** this map intentionally covers the official bank and original pilot only. The later publication of [batch-002](batch-002/REVIEW.md) and [batch-003](batch-003/REVIEW.md) adds 40 study variants in the selected families, bringing the active bank to 160 questions (145 study / 15 benchmark). The original pilot remains unpublished. Counts and “uncovered-in-pilot” labels below describe the pre-expansion inventory, not current coverage across all batches.

This inventory reports the pre-expansion JSON metadata and compact English descriptions of what the **official** questions ask. It is **not pilot concept-match certification, question selection, answer review, factual-support validation, or publication approval**. Family assignments, subjects, topics, pools and citations are reported as stored; objective descriptions come from the official bodies and choices, not from topic tags. No question has been created, selected, approved or published by this map.

For the separate 32 A + 8 B batch plan, see [next-batch-plan.md](next-batch-plan.md).

## Status and scope

- **Active bank:** 120 official questions; zero published generated questions. `data/questions/generated/pilot-001.json` is `[]`, and `src/lib/corpus/index.ts` imports that file alongside the five official files.
- **Pilot:** 50 unpublished drafts, comprising 40 A and 10 B questions. All 50 author-review records have `status: "draft"`; none have approval hashes, `languageReview` or `sourceReview`. The answer-blind export exists, but `data/authoring/pilot-001/independent-review.json` does not exist.
- **Ordinary practice:** only the `study` pool. All 15 official 2026 questions are `benchmark`; their families are excluded from the ordinary next-batch candidate set, including the 11 benchmark families without an assigned pilot draft.
- **Historical archive:** the 2016–2019 papers and the separate B sample are not in the normalized official JSON used here. They are not counted as additional interactive questions or eligible families.
- Topic values are project study categories, not official IPA classifications, and are preserved unchanged. In particular, `22S53` is tagged `law` but actually tests **physical tailgating prevention at a restricted office entrance**, not legal provisions; personal information is the scenario context.

## Exact counts

In the following table, each cell is **question records / distinct `familyId` values**, computed within that row and pool. Pilot family counts overlap official family counts and must not be added without taking a set union. Published generated counts are zero for both subjects and both pools.

| Inventory | Subject | Study questions / families | Benchmark questions / families | All questions / families |
|---|---|---:|---:|---:|
| Active official | A | 84 / 77 | 12 / 12 | 96 / 89 |
| Active official | B | 21 / 19 | 3 / 3 | 24 / 22 |
| Active official | Total | 105 / 96 | 15 / 15 | 120 / 111 |
| Unpublished pilot | A | 37 / 37 | 3 / 3 | 40 / 40 |
| Unpublished pilot | B | 9 / 9 | 1 / 1 | 10 / 10 |
| Unpublished pilot | Total | 46 / 46 | 4 / 4 | 50 / 50 |
| Official + pilot, inventory union only | A | 121 / 79 | 15 / 12 | 136 / 91 |
| Official + pilot, inventory union only | B | 30 / 19 | 4 / 3 | 34 / 22 |
| Official + pilot, inventory union only | Total | 151 / 98 | 19 / 15 | 170 / 113 |

The inventory union is **not the active bank** and is not approval to publish.

### Official-family assignment coverage

“Assigned” means at least one pilot draft has exactly that official `familyId`; it does not mean approved, correct, or conceptually equivalent.

| Pool | Subject | Official families | With assigned pilot draft | Uncovered-in-pilot |
|---|---|---:|---:|---:|
| study | A | 77 | 35 | 42 |
| study | B | 19 | 9 | 10 |
| study | Total | 96 | 44 | 52 |
| benchmark | A | 12 | 3 | 9 |
| benchmark | B | 3 | 1 | 2 |
| benchmark | Total | 15 | 4 | 11 |
| All | A | 89 | 38 | 51 |
| All | B | 22 | 10 | 12 |
| All | Total | 111 | 48 | 63 |

### Topic summary

`A / B` columns are separate subject counts, not ratios. Official family counts include both pools; the last column is the ordinary next-batch candidate capacity. The two pilot-only families are included in pilot question counts but not official family counts.

| Topic | Official questions A / B | Pilot drafts A / B | Official families A / B | Official families study / benchmark | Uncovered study families A / B |
|---|---:|---:|---:|---:|---:|
| management | 11 / 8 | 6 / 4 | 11 / 7 | 15 / 3 | 5 / 2 |
| threats | 16 / 4 | 7 / 1 | 15 / 4 | 18 / 1 | 7 / 3 |
| technology | 23 / 3 | 9 / 2 | 21 / 3 | 21 / 3 | 10 / 1 |
| operations | 15 / 7 | 7 / 3 | 14 / 6 | 17 / 3 | 6 / 2 |
| law | 9 / 2 | 4 / 0 | 8 / 2 | 9 / 1 | 4 / 2 |
| it | 22 / 0 | 7 / 0 | 20 / 0 | 16 / 4 | 10 / 0 |
| Total | 96 / 24 | 40 / 10 | 89 / 22 | 96 / 15 | 42 / 10 |

## ID shorthand and map definitions

The following shorthand is lossless; preserve leading zeros when expanding it:

- `22Snn` = `sg-2022-sample-nn`, e.g. `22S01` = `sg-2022-sample-01`.
- `yyPnn` = `sg-20yy-public-nn`, where `yy` is `23`, `24`, `25` or `26`; e.g. `24P13` = `sg-2024-public-13`.
- `Dnnn` = `sg-generated-pilot-nnn`, e.g. `D019` = `sg-generated-pilot-019`. In the resource table, a range such as `D001–D005` includes every draft ID from D001 through D005.
- In the **Family** column, question-shaped family IDs use the same shorthand. Named family IDs such as `spf` and `risk-assessment-case` are printed verbatim.
- **Official members:** every official question whose stored `familyId` equals this family; no member IDs are omitted.
- **Official tested objective:** an editorial English summary of the original body and choices, including relevant tables/panels/diagram labels. Shared-family descriptions cover both official members; member-specific differences are identified where needed. These are not IPA-authored objective labels, current-law advice, or descriptions/approvals of the assigned drafts. Historical standards and legal references remain those of the originals.
- **Assigned pilot drafts:** drafts whose stored `familyId` equals this family. `uncovered-in-pilot` means that set is empty, even when another draft cites a member.
- **Reference-only pilot drafts:** drafts assigned to a *different* family whose `source.referenceQuestionIds` contains at least one official member of this row. An assigned draft is not repeated in this column. `—` means none.
- Subjects, topics and pools are uniform within every official family in this snapshot. Assigned drafts also match their official family's subject, topic and pool.

**A family assignment or citation is not proof of a concept match, historical grounding of an answer, language quality, or adequate factual support.** Reference-only links do not count as assigned coverage. Conversely, `uncovered-in-pilot` does not mean absent from the active official bank, unseen by a learner, or semantically unaddressed by another question.

## Complete map: all 111 official families

Rows follow first occurrence in filename-sorted official JSON and question-array order. This produces 60 families first encountered in the 2022 sample, 11 in 2023, 11 in 2024, 14 in 2025 and 15 in 2026. Later official members of an existing family remain on its original row.

| Family | Official members | Official tested objective | Subject | Topic | Pool | Assigned pilot drafts | Reference-only pilot drafts |
|---|---|---|---|---|---|---|---|
| 22S01 | 22S01 | Risk acceptance requirements and approval by the risk owner | A | management | study | D001 | — |
| 22S02 | 22S02 | Prevent insider data removal by employees approaching resignation | A | management | study | D006 | — |
| 22S03 | 22S03 | Distinguish corrective action from correction and continual improvement | A | management | study | D004 | — |
| 22S04 | 22S04 | Identify supporting utilities such as server-room air conditioning | A | management | study | uncovered-in-pilot | — |
| 22S05 | 22S05 | Define risk level through consequences and likelihood | A | management | study | D003 | — |
| 22S06 | 22S06 | Identify NISC's establishment alongside the Cybersecurity Strategy Headquarters | A | law | study | uncovered-in-pilot | — |
| 22S07 | 22S07 | CRYPTREC's evaluation and monitoring of recommended cryptographic techniques | A | technology | study | uncovered-in-pilot | — |
| 22S08 | 22S08 | Recognize social engineering using a fabricated emergency | A | threats | study | D007 | — |
| 22S09 | 22S09 | Security benefit of moving web browsing to DMZ-hosted VDI | A | technology | study | uncovered-in-pilot | — |
| forensics | 22S10, 23P03 | Forensic evidence collection/preservation; hashes to verify original-copy identity | A | operations | study | D023 | — |
| 22S11 | 22S11 | Protect a removed storage drive against reading on another PC | A | technology | study | uncovered-in-pilot | — |
| 22S12 | 22S12 | Recognize a rootkit's concealment of malicious tools | A | threats | study | uncovered-in-pilot | — |
| 22S13 | 22S13 | Identify business email compromise and fraudulent payment requests | A | threats | study | D008 | — |
| 22S14 | 22S14 | Explain a botnet command-and-control server's role | A | threats | study | D012 | — |
| 22S15 | 22S15 | Explain why malware command traffic may use allowed HTTP port 80 | A | threats | study | uncovered-in-pilot | — |
| 22S16 | 22S16 | Identify credential stuffing using leaked, reused login credentials | A | threats | study | D009 | — |
| 22S17 | 22S17 | Determine which users are redirected by DNS cache poisoning | A | threats | study | D010 | — |
| 22S18 | 22S18 | Identify authoritative-DNS overload from random-subdomain queries | A | threats | study | uncovered-in-pilot | — |
| 22S19 | 22S19 | Recognize SEO poisoning of web-search rankings | A | threats | study | D011 | — |
| 22S20 | 22S20 | Identify AES as symmetric encryption using the same key | A | technology | study | D014 | — |
| 22S21 | 22S21 | Explain hybrid encryption's key-management and performance benefits | A | technology | study | D015 | — |
| 22S22 | 22S22 | Select private/public keys for signature creation and verification | A | technology | study | D016 | — |
| 22S23 | 22S23 | Identify a block-cipher-based MAC for message integrity checking | A | technology | study | D017 | — |
| risk-based-authentication | 22S24, 24P05 | Recognize extra authentication triggered by an unusual access context | A | technology | study | D018 | — |
| 22S25 | 22S25 | Distinguish CAPTCHA human/bot checks from user authentication | A | technology | study | uncovered-in-pilot | — |
| 22S26 | 22S26 | Identify certificate-based server authentication provided by HTTPS | A | technology | study | D020 | — |
| spf | 22S27, 23P06 | SPF anti-spoofing purpose and DNS-based sender-IP authorization | A | technology | study | D021 | — |
| 22S28 | 22S28 | Identify SMTP-AUTH for authenticating an email sender to its server | A | technology | study | D022 | — |
| malware-analysis | 22S29, 24P03 | Distinguish execution-based malware analysis/detection from static checks | A | threats | study | D013 | — |
| 22S30 | 22S30 | Use port scanning to identify unnecessary exposed server services | A | technology | study | uncovered-in-pilot | — |
| 22S31 | 22S31 | Identify prohibited My Number file creation under the cited 2022 guidance | A | law | study | uncovered-in-pilot | — |
| 22S32 | 22S32 | Identify the law penalizing malware-based deletion of business data | A | law | study | uncovered-in-pilot | — |
| advertising-email | 22S33, 25P07 | Advertising-email law: opt-in principle and sender/commissioning-party duties | A | law | study | D031 | — |
| 22S34 | 22S34 | Determine initial copyright ownership of commissioned software | A | law | study | D032 | — |
| 22S35 | 22S35 | Audit system testing for comprehensive test-case coverage | A | operations | study | uncovered-in-pilot | — |
| 22S36 | 22S36 | Distinguish an access-control auditor's review role from operational duties | A | operations | study | D024 | — |
| 22S37 | 22S37 | Identify management's ultimate responsibility for internal control | A | it | study | uncovered-in-pilot | — |
| 22S38 | 22S38 | Recognize error-proofing through distinguishable operational interfaces | A | operations | study | D025 | — |
| 22S39 | 22S39 | Distinguish a service incident from its cause, detection and response | A | operations | study | uncovered-in-pilot | — |
| 22S40 | 22S40 | Explain WBS decomposition into manageable work units | A | it | study | D034 | — |
| 22S41 | 22S41 | Identify PERT as a project-scheduling technique | A | it | study | D035 | — |
| 22S42 | 22S42 | Identify an active/standby duplex computer system | A | operations | study | D029 | — |
| 22S43 | 22S43 | Explain database audit logs' role in retrospective investigation | A | operations | study | D026 | — |
| proxy | 22S44, 24P10 | Identify a web proxy's request-relay, DNS-resolution and caching roles | A | it | study | D036 | — |
| 22S45 | 22S45 | Identify BPO as outsourcing non-core business processes | A | it | study | D037 | — |
| 22S46 | 22S46 | Identify local-community stakeholders benefiting from corporate social responsibility | A | it | study | uncovered-in-pilot | — |
| 22S47 | 22S47 | Calculate ending inventory value using FIFO | A | it | study | D040 | — |
| 22S48 | 22S48 | Derive gross profit from manufacturing costs and inventory balances | A | it | study | uncovered-in-pilot | — |
| 22S49 | 22S49 | Assess phishing risk from a contractor's predictable scan-to-email defaults | B | management | study | D043 | — |
| risk-assessment-case | 22S50, 23P13 | 22S50: derive website CIA/risk values; 23P13: select risks above the treatment threshold | B | management | study | D042 | — |
| 22S51 | 22S51 | Close patch-management gaps for non-standard software on company PCs | B | threats | study | uncovered-in-pilot | — |
| 22S52 | 22S52 | Assess added malware-risk reduction from fully blocking removable-media access | B | management | study | D044 | — |
| 22S53 | 22S53 | Prevent physical tailgating into a restricted office area; not a legal-provisions question | B | law | study | uncovered-in-pilot | — |
| backup-policy-case | 22S54, 23P14 | 22S54: reduce backup data-loss window; 23P14: prevent backup-target misconfiguration | B | operations | study | D045 | — |
| 22S55 | 22S55 | Identify credential/personal-data phishing simulated by a fake account-unlock drill | B | technology | study | D046 | D019 |
| 22S56 | 22S56 | Assess unauthorized-access risk from saved credentials on shared PCs | B | technology | study | D047 | — |
| 22S57 | 22S57 | Evidence-based self-assessment of least-privilege file permissions | B | management | study | uncovered-in-pilot | — |
| 22S58 | 22S58 | Check vulnerability-testing, reporting and remediation against group requirements | B | threats | study | D048 | — |
| 22S59 | 22S59 | Assign view/input/approval rights under outsourced order-processing duty separation | B | management | study | uncovered-in-pilot | — |
| 22S60 | 22S60 | Recognize BEC credibility tactics from email and invoice evidence | B | operations | study | uncovered-in-pilot | — |
| 23P01 | 23P01 | 2016 Information Security Management Standards and JIS Q 27001/27002 alignment | A | management | study | uncovered-in-pilot | — |
| 23P02 | 23P02 | Identify anti-passback checks on card-based entry/exit sequences | A | technology | study | uncovered-in-pilot | — |
| 23P04 | 23P04 | Compare symmetric and public-key encryption for bulk-data processing | A | technology | study | uncovered-in-pilot | — |
| 23P05 | 23P05 | Interpret matching SHA-256 digests and fixed hash length | A | technology | study | uncovered-in-pilot | — |
| 23P07 | 23P07 | Match web attacks to defenses, including SQL placeholders | A | threats | study | uncovered-in-pilot | — |
| 23P08 | 23P08 | Legal effect and scope of electronic signatures under Japanese law | A | law | study | uncovered-in-pilot | — |
| 23P09 | 23P09 | Identify audit weaknesses in incident reporting and escalation routes | A | operations | study | uncovered-in-pilot | — |
| 23P10 | 23P10 | Explain HTTP-cookie transmission, storage and expiry properties | A | it | study | uncovered-in-pilot | — |
| 23P11 | 23P11 | Identify BPM's continuous business-process management/improvement cycle | A | it | study | uncovered-in-pilot | — |
| cause-effect-diagram | 23P12, 24P12 | Recognize and explain a fishbone cause-and-effect diagram | A | it | study | uncovered-in-pilot | — |
| 23P15 | 23P15 | Reduce the malware-signature update gap exposed by an attachment-infection timeline | B | threats | study | uncovered-in-pilot | — |
| 24P01 | 24P01 | Identify risk assessment's identification, analysis and evaluation stages | A | management | study | uncovered-in-pilot | — |
| 24P02 | 24P02 | Use classification labels to make confidential-information handling obligations clear | A | management | study | uncovered-in-pilot | — |
| 24P04 | 24P04 | Explain the cyber kill chain's attacker-perspective stages | A | threats | study | uncovered-in-pilot | — |
| 24P06 | 24P06 | Verify a TLS server certificate using the CA's public key | A | technology | study | uncovered-in-pilot | D020 |
| 24P07 | 24P07 | Identify the Personal Information Protection Act's scope: living individuals | A | law | study | D030 | D033 |
| 24P08 | 24P08 | Recognize control activities embedded in a business process | A | it | study | uncovered-in-pilot | — |
| 24P09 | 24P09 | Determine how MTBF/MTTR changes affect system availability | A | operations | study | uncovered-in-pilot | — |
| 24P11 | 24P11 | Coordinate enterprise RPA adoption with end-to-end process review | A | it | study | uncovered-in-pilot | — |
| 24P13 | 24P13 | Enable remote SaaS access while strengthening authentication with one-time passwords | B | technology | study | uncovered-in-pilot | D046 |
| 24P14 | 24P14 | Preserve database recovery despite logical corruption and damaged backup media | B | operations | study | uncovered-in-pilot | D045 |
| 24P15 | 24P15 | Respond safely to fake browser malware warnings/support scams | B | threats | study | uncovered-in-pilot | — |
| 25P01 | 25P01 | Distinguish the purposes of risk-management processes, especially risk analysis | A | management | study | uncovered-in-pilot | — |
| 25P02 | 25P02 | Explain SIEM's cross-device log correlation and threat detection | A | operations | study | D027 | — |
| 25P03 | 25P03 | Define zero trust without assuming internal networks are safe | A | technology | study | uncovered-in-pilot | — |
| 25P04 | 25P04 | Distinguish fraud-triangle opportunity, motivation and rationalization | A | management | study | D005 | — |
| 25P05 | 25P05 | Select DNS-cache-poisoning defenses, including restricting external recursive queries | A | threats | study | uncovered-in-pilot | — |
| 25P06 | 25P06 | Distinguish time-varying CVSS v3 temporal metrics from other metric groups | A | threats | study | uncovered-in-pilot | — |
| 25P08 | 25P08 | Audit disciplinary procedures for premature action on suspected security violations | A | operations | study | uncovered-in-pilot | — |
| 25P09 | 25P09 | Calculate weighted service satisfaction and its target-achievement ratio | A | it | study | D039 | — |
| 25P10 | 25P10 | Match RASIS attributes to measures such as MTBF for reliability | A | operations | study | uncovered-in-pilot | — |
| 25P11 | 25P11 | Identify a purpose-specific data mart derived from a data warehouse | A | it | study | uncovered-in-pilot | — |
| 25P12 | 25P12 | Distinguish organization-wide DX from digitization and local process automation | A | it | study | uncovered-in-pilot | — |
| 25P13 | 25P13 | Rate cloud-service availability importance by immediate customer/business impact | B | operations | study | D041 | — |
| 25P14 | 25P14 | Revoke misdirected cloud-file access and inspect download logs for disclosure | B | operations | study | D050 | — |
| 25P15 | 25P15 | Select field-specific anonymization methods while preserving marketing usefulness | B | law | study | uncovered-in-pilot | — |
| 26P01 | 26P01 | Identify residual risk remaining after risk treatment | A | management | benchmark | D002 | — |
| 26P02 | 26P02 | Identify JPCERT/CC's CSIRT-building support materials | A | operations | benchmark | uncovered-in-pilot | — |
| 26P03 | 26P03 | Identify a DMZ between the Internet and an internal network | A | technology | benchmark | uncovered-in-pilot | — |
| 26P04 | 26P04 | Recognize challenge-response authentication using a server-provided random value | A | technology | benchmark | uncovered-in-pilot | — |
| 26P05 | 26P05 | Distinguish white-box vulnerability testing using internal program structure | A | threats | benchmark | uncovered-in-pilot | — |
| 26P06 | 26P06 | Secure-OS mandatory access control and separated, least-privilege administration | A | technology | benchmark | uncovered-in-pilot | — |
| 26P07 | 26P07 | Identify computer-damage business obstruction under the Penal Code | A | law | benchmark | uncovered-in-pilot | — |
| 26P08 | 26P08 | Explain audit follow-up verification of corrective measures | A | operations | benchmark | D028 | — |
| 26P09 | 26P09 | Define a service-level target as a measurable service commitment | A | it | benchmark | uncovered-in-pilot | — |
| 26P10 | 26P10 | Calculate an IPv4 network address from a host address and subnet mask | A | it | benchmark | D038 | — |
| 26P11 | 26P11 | Distinguish big-data analysis from collection, cleaning and business use | A | it | benchmark | uncovered-in-pilot | — |
| 26P12 | 26P12 | Compare acceptance-inspection plans using probability-weighted expected cost | A | it | benchmark | uncovered-in-pilot | — |
| 26P13 | 26P13 | Prevent visitor-pass reuse and unauthorized elevator access to tenant floors | B | management | benchmark | uncovered-in-pilot | — |
| 26P14 | 26P14 | Apply RPO, calculate full/incremental restore time and identify continuity-plan approval | B | operations | benchmark | uncovered-in-pilot | — |
| 26P15 | 26P15 | Evaluate document disclosure, locked storage and disposal against classification rules | B | management | benchmark | D049 | — |

There are **102 singleton official families and nine two-member families**: 102 + 9 = 111 families, containing 102 + 2 × 9 = 120 official questions. Each of the 48 assigned official families has exactly one pilot draft.

### Reference-only links, explicitly separated

The complete map contains five reference-only draft-to-family links:

- `D019` cites `22S55` but is assigned to `authentication-factors`; `22S55` separately has assigned draft `D046`.
- `D020` cites `24P06` but is assigned to `22S26`; `24P06` remains `uncovered-in-pilot`.
- `D033` cites `24P07` but is assigned to `personal-data-outsourcing`; `24P07` separately has assigned draft `D030`.
- `D046` cites `24P13` but is assigned to `22S55`; `24P13` remains `uncovered-in-pilot`.
- `D045` cites `24P14` but is assigned to `backup-policy-case`; `24P14` remains `uncovered-in-pilot`.

Thus `24P06`, `24P13` and `24P14` are still metadata-eligible for the ordinary next batch. The existing citations are listed for context; this map neither rejects these families nor certifies that another draft already tests their concepts. Batch decisions are documented separately in [next-batch-plan.md](next-batch-plan.md).

## Two pilot-only families

These stored family IDs do not occur in the official JSON. They add two A/study families to the inventory union, explaining why 111 official families plus 50 draft records produces **113**, not 161, combined families. They are not candidates for the requested batch of official families without assigned pilot variants.

| Pilot-only family | Assigned draft | Subject | Topic | Pool | Official reference IDs |
|---|---|---|---|---|---|
| authentication-factors | D019 | A | technology | study | 22S55 |
| personal-data-outsourcing | D033 | A | law | study | 24P07 |

A different family ID records a metadata distinction only. The official links and learning-resource citations do not certify that the draft's tested concept matches a historical question or that its answer is supported.

## Pilot factual-resource citation inventory

The 50 pilot drafts contain **50 `source.references` entries across seven resource IDs**, exactly one entry per draft. The table groups those intended factual/learning-resource citations by stored ID; it does not validate the resource contents, cited sections, recommendation status, or support for any answer. Official-question references are a separate field and are mapped above.

| Resource ID | Draft count | Draft IDs | Citation category |
|---|---:|---|---|
| ipa-sg-syllabus-4.1 | 34 | D001–D005, D007–D022, D024–D029, D034–D040 | Syllabus-only |
| ipa-sme-4.0 | 8 | D006, D042–D045, D047–D049 | Non-syllabus resource |
| ipa-incident-4.0 | 1 | D023 | Non-syllabus resource |
| ppc-general | 2 | D030, D033 | Non-syllabus resource |
| caa-email | 1 | D031 | Non-syllabus resource |
| jp-copyright | 1 | D032 | Non-syllabus resource |
| ipa-cloud-4.0 | 3 | D041, D046, D050 | Non-syllabus resource |

**Syllabus-only flag: 34/50 drafts (68%)**, precisely the IDs in the first row, have no non-syllabus `source.references` entry. The other 16 drafts each cite one non-syllabus resource. Neither a syllabus citation nor a non-syllabus citation establishes factual sufficiency or an official/pilot concept match; this is citation presence/absence only.

## Ordinary next-batch candidate inventory

### Complete metadata-eligible candidate set

A candidate must be an **official family**, have `pool === "study"`, and have **no assigned pilot draft**. Reference-only citations do not remove eligibility. The following is the complete candidate set, not a selected batch or a topic quota recommendation.

| Topic | Eligible A family IDs | Eligible B family IDs |
|---|---|---|
| management | 22S04, 23P01, 24P01, 24P02, 25P01 | 22S57, 22S59 |
| threats | 22S12, 22S15, 22S18, 23P07, 24P04, 25P05, 25P06 | 22S51, 23P15, 24P15 |
| technology | 22S07, 22S09, 22S11, 22S25, 22S30, 23P02, 23P04, 23P05, 24P06, 25P03 | 24P13 |
| operations | 22S35, 22S39, 23P09, 24P09, 25P08, 25P10 | 22S60, 24P14 |
| law | 22S06, 22S31, 22S32, 23P08 | 22S53, 25P15 |
| it | 22S37, 22S46, 22S48, 23P10, 23P11, cause-effect-diagram, 24P08, 24P11, 25P11, 25P12 | — |

### Relation to the batch plan

See [next-batch-plan.md](next-batch-plan.md) for the separate 32 A + 8 B plan. This candidate inventory remains the full **42 A + 10 B** metadata-eligible set, not a selection. A 32 A + 8 B subset would leave ten A and two B families outside that subset. There are no B/`it` candidates under the current tags.

Count `cause-effect-diagram` once despite its two official members. All 15 benchmark families and both pilot-only families are outside this ordinary-study candidate set; reference-only citations do not remove eligibility. The plan and any later reviews must distinguish metadata eligibility from concept match and source sufficiency.

**Conditional accounting, not current status:** assigning one future variant to each of 40 selected families would increase official families with draft assignments from 48 to 88 (A: 38 to 70; B: 10 to 18). Study families with assignments would rise from 44 to 84, leaving 12 study families (ten A, two B) and the unchanged 11 benchmark families uncovered: 23 official families total. Pilot plus future drafts would contain 90 questions across 90 draft family IDs. The official-plus-drafts union would still have 113 families because all 40 additions reuse existing official families.

The family-first selector in `src/lib/study.ts` therefore would not gain new selectable family breadth from this batch; it would gain additional members in previously unvaried official families if those drafts were eventually approved and published. No publication or active-bank count change is implied here.

## Reproduction and verification

All paths below are relative to the repository root. No new script is required; the inventory is reproducible by reading the JSON arrays and applying the following grouping/set operations.

### Inputs

- `data/questions/official/sg-2022-sample.json`: 60 questions, 48 A / 12 B, all study.
- `data/questions/official/sg-2023-public.json`: 15 questions, 12 A / 3 B, all study.
- `data/questions/official/sg-2024-public.json`: 15 questions, 12 A / 3 B, all study.
- `data/questions/official/sg-2025-public.json`: 15 questions, 12 A / 3 B, all study.
- `data/questions/official/sg-2026-public.json`: 15 questions, 12 A / 3 B, all benchmark.
- `data/questions/generated/pilot-001.json`: published generated input, empty.
- `data/authoring/pilot-001/questions.json`: all 50 draft records and their reference IDs.
- `data/authoring/pilot-001/reviews.json`: author-review status, not independent approval.
- `data/authoring/pilot-001/blind-review.json`: answer-blind export; its existence is not a completed independent review.
- `data/authoring/families.json`: normalizer's explicit official-family override map. This inventory groups the **stored question `familyId` values**, rather than inferring families from citation links or reconstructing them solely from this override map.
- `src/lib/corpus/index.ts`: active import list; `src/lib/study.ts`: study-pool and family-selection behavior.

### Formulas

Let `O` be the concatenation of the five official arrays in filename order, `P` the pilot draft array, and `G` the published generated array.

- `officialFamilies = unique(O.map(q => q.familyId))`.
- For each official family `f`, `members(f) = O.filter(q => q.familyId === f)`.
- `assigned(f) = P.filter(q => q.familyId === f)`.
- `referenceOnly(f) = P.filter(q => q.familyId !== f && q.source.referenceQuestionIds.some(id => members(f).some(o => o.id === id)))`.
- Mark `f` as `uncovered-in-pilot` exactly when `assigned(f).length === 0`, regardless of `referenceOnly(f)`.
- For any bank/subset `X`, question count is `X.length`; family count is `new Set(X.map(q => q.familyId)).size`. Apply subject/topic/pool filters **before** counting distinct families in summary cells.
- Active questions are `O + G`; the inventory-only union is `O + P`. Combined family counts are set-union counts, never sums of separate bank family counts.
- `pilotOnly = unique(P.map(q => q.familyId))` minus `officialFamilies`.
- For subject `s`, eligible families are official families with uniform `subject === s`, uniform `pool === "study"`, and empty `assigned(f)`. Do not subtract reference-only citations.
- For resource ID `r`, `resourceDrafts(r) = P.filter(q => q.source.references.some(ref => ref.resourceId === r))`; count each draft once per resource. Total reference entries are `P.reduce((n, q) => n + q.source.references.length, 0)`.
- Syllabus-only drafts are `P.filter(q => q.source.references.length > 0 && q.source.references.every(ref => ref.resourceId === "ipa-sg-syllabus-4.1"))`. Expand inclusive D-ID ranges before comparing resource-table sets.
- Objective descriptions are editorial readings of each official member's `blocks` and `choices`, not a grouping formula or an inference from `topic`/`familyId`. Read paragraph text, panel paragraphs, table cells and diagram labels; include printed structured choices as well as plain-text choices. For shared families, read every member. These summaries do not evaluate generated question content.

### Snapshot verification invariants

The saved tables were checked against the JSON metadata, including expanded shorthand IDs:

- Complete map: exactly 111 distinct official family rows and every one of the 120 official IDs exactly once; all member IDs, subject/topic/pool values, assigned draft sets and reference-only draft sets match the inputs.
- Family shape: 102 singleton and nine two-member official families; no mixed-subject, mixed-topic or mixed-pool official family.
- Assignments: 48 drafts assigned to 48 official families, plus two drafts assigned to two pilot-only families; these sets contain each of the 50 draft IDs exactly once. Assigned official-family metadata agrees with the assigned drafts.
- Uncovered: 63 official families, comprising 52 study (42 A / 10 B) and 11 benchmark (9 A / 2 B).
- Reference-only: five draft-to-family links across five official families; three of those families remain uncovered. All referenced official IDs resolve.
- Candidate table: exactly the 52 uncovered study family IDs, with no duplicates, assigned families, pilot-only families or benchmark families.
- Summary tables: question counts and distinct-family counts match filtered JSON sets; official-plus-pilot family union is 113 (91 A / 22 B; 98 study / 15 benchmark).
- Resource table: seven IDs, 50 reference entries, all 50 draft IDs accounted for once in this snapshot; the 34 syllabus-only IDs match the filtered JSON set. This verifies citation metadata, not factual support.
- Objective column: all 111 rows have English descriptions based on the 120 official bodies and choices. Completeness is mechanically checkable; these editorial descriptions do not certify pilot concept matches.

This is a dated snapshot. Recompute from the inputs after any family assignment, question, reference, pool, topic or approval-status change; do not treat these counts or metadata eligibility as permanent semantic approval.
