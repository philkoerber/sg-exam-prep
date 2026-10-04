# Question authoring

The app remains a static Next.js site. Question creation and review happen offline; no model, database, service or account is needed at runtime.

## Files

- `../questions/official/*.json`: canonical official questions. Preserve IDs, Japanese content, choices and official answers. `source.kind` is `official`; source year, number, era and PDF references live under `source`.
- `families.json`: explicit mappings for official questions that share a family. Unmapped originals use their ID as the stable family ID. The normalizer reads this map.
- `pilot-001/questions.json`: canonical generated drafts. `source.kind` is `generated`; reference question IDs and catalogue resource IDs provide provenance without pretending that a generated answer is an IPA answer.
- `pilot-001/reviews.json`: author reasoning, reasoning for every choice, changed conditions and approval status.
- `pilot-001/blind-review.json`: reproducible export without proposed answer keys. Reviewers must not open `questions.json`, `reviews.json`, the authoring scratch scripts or generated answer keys until they have committed their answers.
- `pilot-001/independent-review.json`: independent reviewer results, once completed.
- `pilot-001/language-report.json`: machine-generated language screening, including every unfamiliar word token and kanji.
- `../resources/catalog.json`: versioned source titles, URLs, files, retrieval date and checksums. Resources establish scope or factual support; reference questions establish style. A syllabus listing a term is not, by itself, proof of an answer.
- `../questions/generated/pilot-001.json`: published build input. Produced only by the gated publish command; not a second authoring copy.

## Content shape

Both sources share `id`, `familyId`, `subject`, `topic`, `pool`, `display`, `blocks`, `choices` and `answer`.

`blocks` are the single question-body source: `paragraph`, `table`, `panel` and vector `diagram`. For simple questions, paragraphs render with the existing prompt style. For generated structured questions, the renderer appends their choices using the existing exam layout. A choice contains either `text` or `cells`, never both. `choiceTable.headers` specifies column headings; the rendered choice table is derived from `choices[].cells`. Do not duplicate it inside `blocks`.

Reference questions may supply either format or factual examples; record the distinction in review notes. Assign the same family to actual variants, but not automatically to unrelated learning objectives merely because they use one question as a style reference. Keep 2026-derived benchmark families out of ordinary practice. Avoid cross-subject families unless the selector has enough distinct alternatives for both subjects.

## Review and publication

1. Author a small batch in Japanese, with reference question IDs, factual references, a single defensible answer and a reason for every distractor. Use changed circumstances that affect reasoning, not just renamed companies.
2. Run `npm run corpus:review`. Inspect the complete unfamiliar-token list, unfamiliar kanji, reading length, table headings, labels and standard exam phrasing. Numbers and Latin-only tokens are excluded from the vocabulary metric; inflections are not lemmatized. This is a screening measure, not a grammar, proficiency or difficulty score.
3. A reviewer independently solves the answer-blind export, checks ambiguity, Japanese phrasing and exam structure against the official anchors, and returns one record per question. The record contains `questionId`, `contentHash`, `answer`, `verdict` (`accept` or `revise`), `issues` and `reasoning`. Preserve initial findings when revisions are necessary; only the current accepted review enters `independent-review.json`.
4. Resolve every substantive issue. Re-export and re-review changed questions: content hashes make old approvals invalid. Matching answers alone is not approval. All distractors and necessary assumptions must be checked.
5. In author reviews, set `status: "approved"`, the current `contentHash`, `languageReview` and `sourceReview` only after those checks. Explain necessary new terms; do not expand the official-language baseline with generated questions to make metrics look better.
6. Run `npm run corpus:publish`, then `npm run corpus:validate`, `npm test`, `npm run build` and `npm run test:e2e`.

Publication requires both accepted reviews, matching independent answers, current content hashes, complete choice reasoning, valid source IDs, a minimum 90% existing-word-token overlap and a 98% existing-kanji occurrence floor for every question. The overall kanji target is at least 99%. Necessary technical vocabulary is explicitly reviewed even above these floors. These are pilot screening thresholds, not empirically validated measures of Japanese or exam difficulty.

The pilot includes independent calculations from the displayed tables for subnet masks, weighted averages, FIFO inventory, risk values and incremental backup chains. Browser checks render all official questions and all candidates using the production question component, at desktop and phone sizes, without publishing drafts to an app route.

Independent AI review is not native-speaker or SG-expert validation. No attempt is made to reproduce IPA's calibrated difficulty or IRT score. Human learner results or expert review would be needed for those claims.
