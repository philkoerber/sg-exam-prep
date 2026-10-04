import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { officialCorpus } from "../src/lib/corpus";
import {
  choiceText,
  questionBlocks,
  questionPrompt,
} from "../src/lib/corpus/content";
import { questionSchema, type Question } from "../src/lib/corpus/schema";
import { practiceQuestions, examQuestions } from "../src/lib/study";
import {
  readPilot,
  questionDigest,
  languageMetrics,
} from "../scripts/pilot-review";
import {
  validateCandidate,
  validateApproval,
  type Review,
  type BlindReview,
} from "../scripts/validate-pilot";

const pilot = readPilot();
const all = [...officialCorpus, ...pilot];
const q = (n: number) =>
  pilot.find(
    (q) => q.id === `sg-generated-pilot-${String(n).padStart(3, "0")}`,
  )!;
const answerText = (q: Question) =>
  choiceText(q.choices.find((c) => c.key === q.answer)!);
function seeded() {
  let state = 19;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("pilot has 40 A and 10 B questions with resolvable references and no invented official metadata", () => {
  assert.equal(pilot.length, 50);
  assert.equal(pilot.filter((q) => q.subject === "A").length, 40);
  assert.equal(pilot.filter((q) => q.subject === "B").length, 10);
  assert.equal(new Set(pilot.map((q) => q.topic)).size, 6);
  pilot.forEach((q) => validateCandidate(q, officialCorpus));
  assert.equal(
    questionSchema.safeParse({
      ...q(1),
      source: { ...q(1).source, year: 2026, answerUrl: "https://example.com" },
    }).success,
    false,
  );
});

test("mock exams and practice never repeat a family, even when an original has many variants", () => {
  const random = seeded();
  for (let i = 0; i < 100; i++) {
    const exam = examQuestions(all, random);
    assert.equal(exam.length, 60);
    assert.equal(exam.filter((q) => q.subject === "A").length, 48);
    assert.equal(new Set(exam.map((q) => q.familyId)).size, 60);
    const practice = practiceQuestions(all, "all", 10, random);
    assert.equal(
      new Set(practice.map((q) => q.familyId)).size,
      practice.length,
    );
    assert.ok(practice.every((q) => q.pool === "study"));
  }
  const twoFamilies = [
    q(1),
    ...Array.from({ length: 100 }, (_, i) => ({ ...q(3), id: `variant-${i}` })),
  ];
  let largeFamily = 0;
  for (let i = 0; i < 1000; i++)
    if (
      practiceQuestions(twoFamilies, "all", 1, random)[0].familyId ===
      q(3).familyId
    )
      largeFamily++;
  assert.ok(
    largeFamily > 430 && largeFamily < 570,
    `${largeFamily}: variant count must not weight family selection`,
  );
});

test("exam refuses insufficient distinct families even when there are enough question IDs", () => {
  const b = all.find((q) => q.subject === "B")!;
  assert.throws(() =>
    examQuestions([
      ...all.filter((q) => q.subject === "A"),
      ...Array.from({ length: 20 }, (_, i) => ({ ...b, id: `b${i}` })),
    ]),
  );
});

test("generated answer tables come from a single set of choice cells", () => {
  for (const q of pilot.filter((q) => q.choiceTable)) {
    const table = questionBlocks(q).at(-1)!;
    assert.equal(table.type, "table");
    if (table.type !== "table") continue;
    assert.deepEqual(
      table.rows.slice(1).map((r) => r.map((c) => c.text)),
      q.choices.map((c) => [c.key, ...c.cells!]),
    );
    assert.ok(q.choices.every((c) => c.text === undefined));
  }
});

test("independent arithmetic checks solve the displayed data, not the proposed answer key", () => {
  const subnet = questionPrompt(q(38)).match(/\d+\.\d+\.\d+\.\d+/g)!;
  const network = subnet[0]
    .split(".")
    .map((octet, i) => Number(octet) & Number(subnet[1].split(".")[i]))
    .join(".");
  assert.equal(answerText(q(38)), network);
  const satisfaction = q(39).blocks.find((b) => b.type === "table")!;
  assert.equal(satisfaction.type, "table");
  if (satisfaction.type === "table") {
    const rows = satisfaction.rows
      .slice(1)
      .map((r) => r.map((c) => Number(c.text)));
    const target = Number(questionPrompt(q(39)).match(/中([\d.]+)点/)![1]);
    const result =
      rows.reduce((n, [score, count]) => n + score * count, 0) /
      rows.reduce((n, r) => n + r[1], 0) /
      target;
    assert.equal(Number(answerText(q(39))), result);
  }
  const inventory = q(40).blocks.find((b) => b.type === "table")!;
  if (inventory.type === "table") {
    let remaining = Number(
      questionPrompt(q(40)).match(/期末在庫が(\d+)個/)![1],
    );
    let value = 0;
    for (const row of [...inventory.rows.slice(1)].reverse()) {
      const used = Math.min(remaining, Number(row[1].text));
      value += used * Number(row[2].text);
      remaining -= used;
    }
    assert.equal(remaining, 0);
    assert.equal(Number(answerText(q(40))), value);
  }
  const risk = q(42).blocks.find((b) => b.type === "table")!;
  if (risk.type === "table") {
    const decisions = risk.rows.slice(1).map((r) => {
      const n = r.slice(1).map((c) => Number(c.text));
      return Math.max(...n.slice(0, 3)) * n[3] * n[4] >= 6 ? "○" : "×";
    });
    assert.equal(answerText(q(42)), decisions.join(" / "));
  }
  const backups = q(45).blocks.find((b) => b.type === "table")!;
  if (backups.type === "table") {
    const chain = backups.rows
      .slice(1)
      .filter((r) => r[2].text === "成功")
      .map((r) => `${r[0].text}の${r[1].text}`)
      .join("，");
    assert.equal(answerText(q(45)), chain);
  }
});

test("pilot language remains close to the frozen official baseline", () => {
  for (const q of pilot) {
    const m = languageMetrics(q, officialCorpus);
    assert.ok(
      m.wordCoverage >= 0.9,
      `${q.id}: word coverage ${m.wordCoverage}`,
    );
    assert.ok(
      m.kanjiCoverage >= 0.98,
      `${q.id}: kanji coverage ${m.kanjiCoverage}`,
    );
  }
});

test("publication rejects unreviewed, changed, ambiguous, or answer-mismatched questions", () => {
  const sample = q(1);
  const original = JSON.parse(
    readFileSync("data/authoring/pilot-001/reviews.json", "utf8"),
  ) as Review[];
  const review: Review = {
    ...original[0],
    status: "approved",
    contentHash: questionDigest(sample),
    languageReview: "Test-only review fixture: all language flags checked.",
    sourceReview: "Test-only review fixture: source checked.",
  };
  const blind: BlindReview = {
    questionId: sample.id,
    contentHash: questionDigest(sample),
    answer: sample.answer,
    verdict: "accept",
    issues: [],
    reasoning: "Test-only review fixture; not an actual content approval.",
  };
  assert.doesNotThrow(() =>
    validateApproval(sample, officialCorpus, review, blind),
  );
  assert.throws(() =>
    validateApproval(
      sample,
      officialCorpus,
      { ...review, status: "draft" },
      blind,
    ),
  );
  assert.throws(() =>
    validateApproval(sample, officialCorpus, review, {
      ...blind,
      answer: "invalid",
    }),
  );
  assert.throws(() =>
    validateApproval(sample, officialCorpus, review, {
      ...blind,
      issues: ["Two defensible answers"],
    }),
  );
  assert.throws(() =>
    validateApproval(
      { ...sample, blocks: [{ type: "paragraph", text: "Changed question" }] },
      officialCorpus,
      review,
      blind,
    ),
  );
});
