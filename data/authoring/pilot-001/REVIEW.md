# Pilot 001 review status

50 drafts: 40 subject A questions and 10 subject B case studies. The originals remain separately identifiable and unchanged. No pilot questions are published until the independent review gate passes.

Completed checks:

- Author-written correct-answer reasoning and a rationale for every distractor.
- Reference question and learning-resource links for every question; seven additional primary references saved locally with checksums.
- Japanese token and kanji screening against the 120 official questions. All unfamiliar tokens are listed in `language-report.json`; some are inflected forms of familiar words rather than new vocabulary.
- Formula-based solutions independently calculated from the displayed data for five numerical/procedural questions.
- Schema checks, unique choices, family selection and rejection of stale or incomplete approvals.
- Original migration compared against the pre-change JSON: displayed wording, options, keys and PDF references are preserved for all 120 originals.
- Production build, lint, 19 unit tests and 22 desktop/phone browser tests passed. Browser fixtures use the production question renderer for all 120 originals and all 50 drafts.

Language screening for the full draft batch: 97.29% of Japanese word-token occurrences and 99.86% of kanji occurrences also appear in the official corpus. Per-question minima are 92.31% and 98.86%, respectively. New kanji are 危, 未, 督, 紛 and 舗; the independent review must assess their wording in context, together with all unfamiliar tokens. These percentages measure overlap, not correctness, fluency or difficulty.

Pending: permission to delegate the answer-blind content review, resolution of any review findings, and publication into the app's active pool. Author notes are not independent approval.

The standard is a single defensible answer, plausible distractors, faithful Japanese and familiar exam structure. The automated checks do not establish official-level difficulty or guarantee that every question is free of ambiguity.
