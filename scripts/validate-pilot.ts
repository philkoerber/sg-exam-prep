import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import type { Question } from "../src/lib/corpus/schema";
import { choiceText, questionBlocks } from "../src/lib/corpus/content";
import { contentBlockSchema } from "../src/lib/corpus/schema";
import { readJson } from "./corpus-files";
import { contentText, questionDigest, languageMetrics } from "./pilot-review";
import { getBatch, readBatch, readBatchJson } from "./corpus-batches";

export type Review = {
  questionId: string;
  status: "draft" | "approved";
  contentHash?: string;
  rule: string;
  choiceReasons: Record<string, string>;
  variation: string;
  languageReview?: string;
  sourceReview?: string;
};
export type BlindReview = {
  questionId: string;
  contentHash: string;
  answer: string;
  verdict: "accept" | "revise";
  issues: string[];
  reasoning: string;
};
export function validateCandidate(q: Question, official: Question[]) {
  assert.equal(q.source.kind, "generated");
  if (q.source.kind !== "generated") return;
  const refs = q.source.referenceQuestionIds.map((id) =>
    official.find((q) => q.id === id),
  );
  assert.ok(refs.every(Boolean), `${q.id}: unknown official reference`);
  assert.equal(new Set(q.source.referenceQuestionIds).size, refs.length);
  const resources = readJson<{ id: string }[]>("data/resources/catalog.json");
  assert.ok(
    q.source.references.every((r) =>
      resources.some((s) => s.id === r.resourceId),
    ),
    `${q.id}: unknown learning resource`,
  );
  assert.ok(
    q.choices.every(
      (c, i) => c.key === [..."アイウエオカキクケコサシスセソ"][i],
    ),
    `${q.id}: choice key order`,
  );
  assert.equal(
    new Set(q.choices.map(choiceText)).size,
    q.choices.length,
    `${q.id}: identical choices`,
  );
  assert.ok(
    q.choices.every((c) => choiceText(c).trim().length),
    `${q.id}: empty choice`,
  );
  assert.ok(
    !official.some((o) => contentText(o) === contentText(q)),
    `${q.id}: exact copy`,
  );
  questionBlocks(q).forEach((block) => contentBlockSchema.parse(block));
  // A study reference alongside a benchmark reference does not remove leakage.
  if (refs.some((q) => q!.pool === "benchmark"))
    assert.equal(
      q.pool,
      "benchmark",
      `${q.id}: benchmark reference in study pool`,
    );
  for (const member of official.filter((o) => o.familyId === q.familyId))
    assert.equal(
      q.pool,
      member.pool,
      `${q.id}: family pool mismatch (benchmark isolation)`,
    );
}
export function validateApproval(
  q: Question,
  official: Question[],
  review: Review | undefined,
  blind: BlindReview | undefined,
) {
  validateCandidate(q, official);
  const hash = questionDigest(q);
  assert.ok(
    review && review.status === "approved",
    `${q.id}: author review not approved`,
  );
  assert.equal(
    review.questionId,
    q.id,
    `${q.id}: author review question ID mismatch`,
  );
  assert.equal(review.contentHash, hash, `${q.id}: stale author review`);
  assert.deepEqual(
    Object.keys(review.choiceReasons).sort(),
    q.choices.map((c) => c.key).sort(),
    `${q.id}: missing distractor reasoning`,
  );
  for (const text of [
    review.rule,
    review.variation,
    review.languageReview,
    review.sourceReview,
    ...Object.values(review.choiceReasons),
  ])
    assert.ok(text && text.length >= 10, `${q.id}: incomplete review`);
  assert.ok(
    blind && blind.verdict === "accept",
    `${q.id}: blind review not accepted`,
  );
  assert.equal(
    blind.questionId,
    q.id,
    `${q.id}: blind review question ID mismatch`,
  );
  assert.equal(blind.contentHash, hash, `${q.id}: stale blind review`);
  assert.equal(blind.answer, q.answer, `${q.id}: blind answer disagrees`);
  assert.equal(blind.issues.length, 0, `${q.id}: unresolved review findings`);
  assert.ok(blind.reasoning.length >= 10);
  const metrics = languageMetrics(q, official);
  assert.ok(metrics.wordCoverage >= 0.9, `${q.id}: word coverage below 90%`);
  // Small numbers of necessary technical kanji are reviewed explicitly, rather
  // than silently rewriting the baseline to include generated questions.
  assert.ok(metrics.kanjiCoverage >= 0.98, `${q.id}: kanji coverage below 98%`);
  const text = contentText(q).replace(/\s/g, "");
  assert.ok(
    text.length >= (q.subject === "B" ? 500 : 30),
    `${q.id}: insufficient context`,
  );
}
export type BatchRecords = {
  candidates: Question[];
  reviews: Review[];
  independent: BlindReview[];
};

export function readBatchRecords(
  id: string = "pilot-001",
  requireIndependent = false,
): BatchRecords {
  const batch = getBatch(id);
  return {
    candidates: readBatch(batch.id),
    reviews: readBatchJson<Review[]>(batch.id, "reviews.json"),
    independent:
      requireIndependent ||
      existsSync(`${batch.authoringPath}/independent-review.json`)
        ? readBatchJson<BlindReview[]>(batch.id, "independent-review.json")
        : [],
  };
}

export function validateQuestionInventory(questions: Question[]) {
  assert.equal(
    new Set(questions.map((q) => q.id)).size,
    questions.length,
    "Duplicate question IDs across corpus/batches",
  );
  const pools = new Map<string, Question["pool"]>();
  for (const q of questions) {
    const pool = pools.get(q.familyId);
    if (pool)
      assert.equal(
        q.pool,
        pool,
        `${q.id}: family pool mismatch (benchmark isolation)`,
      );
    pools.set(q.familyId, q.pool);
  }
}

export function validatePublishedBatch(
  id: string,
  published: Question[],
  official: Question[],
  records = readBatchRecords(id, published.length > 0),
) {
  const batch = getBatch(id);
  const { candidates, reviews, independent } = records;
  validateQuestionInventory([...official, ...candidates]);
  validateQuestionInventory([...official, ...published]);
  candidates.forEach((q) => validateCandidate(q, official));
  for (const [label, entries] of [
    ["author", reviews],
    ["independent", independent],
  ] as const) {
    assert.equal(
      new Set(entries.map((r) => r.questionId)).size,
      entries.length,
      `${batch.id}: duplicate ${label} review question IDs`,
    );
    for (const review of entries)
      assert.ok(
        candidates.some((q) => q.id === review.questionId),
        `${batch.id}: ${label} review for unknown draft ${review.questionId}`,
      );
  }
  for (const q of published) {
    assert.deepEqual(
      q,
      candidates.find((c) => c.id === q.id),
      `${batch.id}/${q.id}: published data differs from reviewed draft`,
    );
    validateApproval(
      q,
      official,
      reviews.find((r) => r.questionId === q.id),
      independent.find((r) => r.questionId === q.id),
    );
  }
  assert.deepEqual(
    published.map((q) => q.id).sort(),
    reviews
      .filter((r) => r.status === "approved")
      .map((r) => r.questionId)
      .sort(),
    `${batch.id}: Approved questions and published questions must match`,
  );
}

export function validatePublishedPilot(
  published: Question[],
  official: Question[],
) {
  return validatePublishedBatch("pilot-001", published, official);
}
