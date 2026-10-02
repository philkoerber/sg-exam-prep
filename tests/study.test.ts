import { test } from "node:test";
import assert from "node:assert/strict";
import { corpus } from "../src/lib/corpus";
import { questionSchema } from "../src/lib/corpus/schema";
import {
  examQuestions,
  practiceQuestions,
  score,
  remainingSeconds,
  formatTime,
  shuffle,
} from "../src/lib/study";

test("all imported questions have valid official answer mappings", () => {
  assert.equal(corpus.length, 120);
  assert.equal(new Set(corpus.map((q) => q.id)).size, corpus.length);
  corpus.forEach((q) => questionSchema.parse(q));
});
test("topic practice stays in its topic and keeps benchmark questions reserved", () => {
  for (let run = 0; run < 20; run++) {
    const questions = practiceQuestions(corpus, "technology");
    assert.equal(questions.length, 10);
    assert.ok(
      questions.every((q) => q.pool === "study" && q.topic === "technology"),
    );
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  }
});
test("exam always has 48 A and 12 B without duplicate IDs or corpus mutation", () => {
  const original = corpus.map((q) => q.id);
  for (let run = 0; run < 20; run++) {
    const questions = examQuestions(corpus);
    assert.equal(questions.length, 60);
    assert.equal(questions.filter((q) => q.subject === "A").length, 48);
    assert.equal(questions.filter((q) => q.subject === "B").length, 12);
    assert.equal(new Set(questions.map((q) => q.id)).size, 60);
  }
  assert.deepEqual(
    corpus.map((q) => q.id),
    original,
  );
});
test("exam fails clearly when there are insufficient B questions", () =>
  assert.throws(() => examQuestions(corpus.filter((q) => q.subject === "A"))));
test("unanswered and invalid answers are not counted as correct or answered", () => {
  const qs = corpus.slice(0, 3);
  assert.deepEqual(
    score(qs, { [qs[0].id]: qs[0].answer, [qs[1].id]: "invalid" }),
    { correct: 1, answered: 1, total: 3, percent: 33 },
  );
  assert.deepEqual(score([], {}), {
    correct: 0,
    answered: 0,
    total: 0,
    percent: 0,
  });
});
test("timer uses absolute deadline and handles sleep and expiration", () => {
  assert.equal(remainingSeconds(10000, 0), 10);
  assert.equal(remainingSeconds(10000, 9500), 1);
  assert.equal(remainingSeconds(10000, 11000), 0);
  assert.equal(formatTime(7200), "120:00");
  assert.equal(formatTime(61), "01:01");
  assert.equal(formatTime(-1), "00:00");
});
test("shuffle returns an independent array even for empty and singleton inputs", () => {
  assert.deepEqual(shuffle([]), []);
  const a = [1];
  assert.notEqual(shuffle(a), a);
  assert.deepEqual(shuffle(a), a);
});
