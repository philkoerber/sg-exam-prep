import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Question } from "../src/lib/corpus/schema";
import { choiceText } from "../src/lib/corpus/content";
import { readJson } from "./corpus-files";
import {
  contentText,
  questionDigest,
  languageMetrics,
  pilotPath,
  readPilot,
} from "./pilot-review";

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
  // A reference from the reserved family must not leak into ordinary practice.
  if (refs.every((q) => q!.pool === "benchmark"))
    assert.equal(q.pool, "benchmark");
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
export function validatePublishedPilot(
  published: Question[],
  official: Question[],
) {
  const candidates = readPilot();
  const reviews = readJson<Review[]>(`${pilotPath}/reviews.json`);
  assert.equal(new Set(candidates.map((q) => q.id)).size, candidates.length);
  assert.equal(new Set(reviews.map((r) => r.questionId)).size, reviews.length);
  candidates.forEach((q) => validateCandidate(q, official));
  const blind: BlindReview[] = published.length
    ? JSON.parse(readFileSync(`${pilotPath}/independent-review.json`, "utf8"))
    : [];
  for (const q of published) {
    assert.deepEqual(
      q,
      candidates.find((c) => c.id === q.id),
      `${q.id}: published data differs from reviewed draft`,
    );
    validateApproval(
      q,
      official,
      reviews.find((r) => r.questionId === q.id),
      blind.find((r) => r.questionId === q.id),
    );
  }
  assert.deepEqual(
    published.map((q) => q.id).sort(),
    reviews
      .filter((r) => r.status === "approved")
      .map((r) => r.questionId)
      .sort(),
    "Approved questions and published questions must match",
  );
}
