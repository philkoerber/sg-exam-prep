import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import {
  generatedBanks,
  generatedCorpus,
  officialCorpus,
} from "../src/lib/corpus";
import type { Question } from "../src/lib/corpus/schema";
import {
  batches,
  getBatch,
  readBatch,
  readPublishedBatches,
  selectBatch,
} from "../scripts/corpus-batches";
import {
  contentText,
  languageMetrics,
  questionDigest,
  readPilot,
} from "../scripts/pilot-review";
import {
  validateApproval,
  validateCandidate,
  validatePublishedBatch,
  validatePublishedPilot,
  validateQuestionInventory,
  type BatchRecords,
} from "../scripts/validate-pilot";

const sample = readPilot()[0];
const tsxLoader = pathToFileURL(
  createRequire(resolve("package.json")).resolve("tsx"),
).href;
function candidate(id = "batch-002-fixture"): Question {
  return { ...structuredClone(sample), id };
}
function records(q = candidate()): BatchRecords {
  // Synthetic approvals exercise the gates only, never approve authoring data.
  return {
    candidates: [q],
    reviews: [
      {
        questionId: q.id,
        status: "approved",
        contentHash: questionDigest(q),
        rule: "Test-only rule, not a content approval.",
        variation: "Test-only variation, not a content approval.",
        languageReview: "Test-only language review, not a content approval.",
        sourceReview: "Test-only source review, not a content approval.",
        choiceReasons: Object.fromEntries(
          q.choices.map((c) => [
            c.key,
            "Test-only choice reasoning, not a content approval.",
          ]),
        ),
      },
    ],
    independent: [
      {
        questionId: q.id,
        contentHash: questionDigest(q),
        answer: q.answer,
        verdict: "accept",
        issues: [],
        reasoning: "Test-only independent reasoning, not a content approval.",
      },
    ],
  };
}
function validate(data: BatchRecords, published = data.candidates) {
  return validatePublishedBatch("batch-002", published, officialCorpus, data);
}
function writeJson(root: string, path: string, data: unknown) {
  writeFileSync(join(root, path), JSON.stringify(data));
}
function readJson(root: string, path: string) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}
function sandbox(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "sg-batches-"));
  try {
    mkdirSync(join(root, "data/questions/generated"), { recursive: true });
    mkdirSync(join(root, "data/resources"), { recursive: true });
    cpSync("data/questions/official", join(root, "data/questions/official"), {
      recursive: true,
    });
    cpSync(
      "data/resources/catalog.json",
      join(root, "data/resources/catalog.json"),
    );
    for (const batch of batches) writeJson(root, batch.publishedPath, []);
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function writeRecords(root: string, id: string, data: BatchRecords) {
  const batch = getBatch(id);
  mkdirSync(join(root, batch.authoringPath), { recursive: true });
  writeJson(root, `${batch.authoringPath}/questions.json`, data.candidates);
  writeJson(root, `${batch.authoringPath}/reviews.json`, data.reviews);
  writeJson(
    root,
    `${batch.authoringPath}/independent-review.json`,
    data.independent,
  );
}
function cli(root: string, path: string, args: string[] = []) {
  return spawnSync(
    process.execPath,
    ["--import", tsxLoader, resolve("tests", path), ...args],
    {
      cwd: root,
      env: { ...process.env, TSX_TSCONFIG_PATH: resolve("tsconfig.json") },
      encoding: "utf8",
      timeout: 30_000,
    },
  );
}

test("batch selection defaults to pilot and rejects unknown IDs, paths and extra arguments", () => {
  assert.equal(selectBatch([]).id, "pilot-001");
  for (const batch of batches) assert.equal(selectBatch([batch.id]), batch);
  for (const id of [
    "",
    "batch-004",
    "../pilot-001",
    "batch-002/../pilot-001",
    "/tmp/batch-002",
    "..\\batch-002",
    "__proto__",
    "constructor",
  ])
    assert.throws(() => getBatch(id), /Unknown batch/);
  assert.throws(() => selectBatch(["batch-002", "batch-003"]), /at most one/);
  assert.deepEqual(readBatch(), readPilot());
  assert.doesNotThrow(() => validatePublishedPilot([], officialCorpus));
});

test("all registered generated banks are statically imported at runtime", () => {
  assert.deepEqual(
    Object.keys(generatedBanks).sort(),
    batches.map((b) => b.id).sort(),
  );
  const banks = readPublishedBatches();
  for (const bank of banks)
    assert.deepEqual(generatedBanks[bank.id], bank.questions);
  assert.deepEqual(
    generatedCorpus,
    banks.flatMap((bank) => bank.questions),
  );
});

test("both CLIs reject unknown batches before reading or writing any files", () => {
  sandbox((root) => {
    for (const path of [
      "../scripts/review-pilot.ts",
      "../scripts/publish-pilot.ts",
    ]) {
      const result = cli(root, path, ["../pilot-001"]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Unknown batch/);
    }
    assert.equal(existsSync(join(root, "data/authoring")), false);
  });
});

test("unfinished authoring fails clearly without creating placeholder drafts", () => {
  sandbox((root) => {
    for (const path of [
      "../scripts/review-pilot.ts",
      "../scripts/publish-pilot.ts",
    ]) {
      const result = cli(root, path, ["batch-002"]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /batch-002: missing data\/authoring\/batch-002\/questions.json; authoring\/review is not complete/,
      );
    }
    assert.equal(existsSync(join(root, "data/authoring")), false);
  });
});

test("review CLI selects only its batch, keeps a fixed official baseline and omits answers", () => {
  sandbox((root) => {
    for (const batch of batches)
      writeRecords(root, batch.id, records(candidate(`${batch.id}-fixture`)));
    // Also exercise the old no-argument pilot command in the isolated fixture.
    for (const args of [[], ["batch-002"], ["batch-003"]]) {
      const batch = selectBatch(args);
      const q = candidate(`${batch.id}-fixture`);
      const result = cli(root, "../scripts/review-pilot.ts", args);
      assert.equal(result.status, 0, result.stderr);
      const blind = readJson(root, `${batch.authoringPath}/blind-review.json`);
      assert.deepEqual(
        blind.map((entry: { id: string }) => entry.id),
        [q.id],
      );
      assert.equal("answer" in blind[0], false);
      assert.equal(blind[0].contentHash, questionDigest(q));
      const solve = readJson(root, `${batch.authoringPath}/solve-only.json`);
      assert.deepEqual(solve, [
        {
          id: q.id,
          subject: q.subject,
          display: q.display,
          blocks: q.blocks,
          choices: q.choices,
          contentHash: questionDigest(q),
        },
      ]);
      for (const hidden of ["answer", "source", "familyId", "topic", "pool"])
        assert.equal(hidden in solve[0], false);
      const report = readJson(
        root,
        `${batch.authoringPath}/language-report.json`,
      );
      assert.equal(report.minimumWordCoverage, 0.9);
      assert.equal(report.minimumKanjiCoverage, 0.98);
      assert.deepEqual(report.questions, [
        {
          questionId: q.id,
          contentHash: questionDigest(q),
          ...languageMetrics(q, officialCorpus),
        },
      ]);
      rmSync(join(root, `${batch.authoringPath}/blind-review.json`));
      rmSync(join(root, `${batch.authoringPath}/language-report.json`));
      rmSync(join(root, `${batch.authoringPath}/solve-only.json`));
      for (const other of batches) {
        assert.equal(
          existsSync(join(root, `${other.authoringPath}/solve-only.json`)),
          false,
        );
        assert.equal(
          existsSync(join(root, `${other.authoringPath}/blind-review.json`)),
          false,
        );
        assert.equal(
          existsSync(join(root, `${other.authoringPath}/language-report.json`)),
          false,
        );
        assert.deepEqual(readJson(root, other.publishedPath), []);
      }
    }
  });
});

test("publication writes only the selected reviewed batch, independently of unfinished batches", () => {
  for (const args of [[], ["batch-002"], ["batch-003"]])
    sandbox((root) => {
      const batch = selectBatch(args);
      const data = records(candidate(`${batch.id}-fixture`));
      writeRecords(root, batch.id, data);
      const result = cli(root, "../scripts/publish-pilot.ts", args);
      assert.equal(result.status, 0, result.stderr);
      for (const bank of batches)
        assert.deepEqual(
          readJson(root, bank.publishedPath),
          bank.id === batch.id ? data.candidates : [],
        );
      assert.deepEqual(
        readJson(root, `${batch.authoringPath}/reviews.json`),
        data.reviews,
      );
      assert.deepEqual(
        readJson(root, `${batch.authoringPath}/independent-review.json`),
        data.independent,
      );
    });
});

test("failed CLI publication leaves every generated bank untouched", () => {
  sandbox((root) => {
    for (const failure of ["draft", "stale", "missing independent"] as const) {
      const data = records();
      if (failure === "draft") data.reviews[0].status = "draft";
      if (failure === "stale") data.independent[0].contentHash = "stale";
      writeRecords(root, "batch-002", data);
      if (failure === "missing independent")
        rmSync(join(root, "data/authoring/batch-002/independent-review.json"));
      const result = cli(root, "../scripts/publish-pilot.ts", ["batch-002"]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /author review not approved|stale blind review|missing .*independent-review.json/,
      );
      for (const bank of batches)
        assert.deepEqual(readJson(root, bank.publishedPath), []);
    }
  });
});

test("corpus validator rejects unknown or missing generated banks even when empty", () => {
  sandbox((root) => {
    writeJson(root, "data/questions/generated/unregistered.json", []);
    let result = cli(root, "../scripts/validate-corpus.ts");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Generated files must exactly match/);
    rmSync(join(root, "data/questions/generated/unregistered.json"));
    rmSync(join(root, "data/questions/generated/batch-003.json"));
    result = cli(root, "../scripts/validate-corpus.ts");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Generated files must exactly match/);
  });
});

test("published records and review IDs cannot cross batch boundaries", () => {
  const data = records();
  assert.doesNotThrow(() => validate(data));
  assert.throws(
    () => validate(data, [candidate("batch-003-fixture")]),
    /differs from reviewed draft/,
  );
  for (const field of ["reviews", "independent"] as const) {
    const foreign = structuredClone(data);
    foreign[field][0].questionId = "batch-003-fixture";
    assert.throws(() => validate(foreign), /review for unknown draft/);
  }
  for (const duplicate of [
    { ...data, reviews: [...data.reviews, ...data.reviews] },
    { ...data, independent: [...data.independent, ...data.independent] },
  ])
    assert.throws(() => validate(duplicate), /duplicate .*review question IDs/);
  assert.throws(
    () =>
      validateQuestionInventory([
        ...officialCorpus,
        ...data.candidates,
        ...data.candidates,
      ]),
    /Duplicate question IDs/,
  );
});

test("unpublished drafts are validated without treating them as approved content", () => {
  const data = records();
  data.reviews[0].status = "draft";
  data.independent = [];
  assert.doesNotThrow(() => validate(data, []));
  assert.throws(() => validate(data), /author review not approved/);
  data.candidates[0].choices[1].text = data.candidates[0].choices[0].text;
  assert.throws(() => validate(data, []), /identical choices/);
  assert.throws(
    () => validate(records(), []),
    /Approved questions and published questions must match/,
  );
});

test("publication requires current accepted reviews and exact choice-reason keys", () => {
  for (const field of ["reviews", "independent"] as const) {
    const data = records();
    data[field][0].contentHash = "stale";
    assert.throws(() => validate(data), /stale .*review/);
  }
  const missing = records();
  missing.independent = [];
  assert.throws(() => validate(missing), /blind review not accepted/);
  const revise = records();
  revise.independent[0].verdict = "revise";
  assert.throws(() => validate(revise), /blind review not accepted/);
  const issues = records();
  issues.independent[0].issues = ["Ambiguous answer"];
  assert.throws(() => validate(issues), /unresolved review findings/);
  for (const extra of [false, true]) {
    const data = records();
    if (extra) data.reviews[0].choiceReasons["オ"] = "Not a valid choice key.";
    else delete data.reviews[0].choiceReasons["ア"];
    assert.throws(() => validate(data), /missing distractor reasoning/);
  }
  const data = records();
  assert.throws(
    () =>
      validateApproval(
        data.candidates[0],
        officialCorpus,
        { ...data.reviews[0], questionId: "other" },
        data.independent[0],
      ),
    /author review question ID mismatch/,
  );
  assert.throws(
    () =>
      validateApproval(data.candidates[0], officialCorpus, data.reviews[0], {
        ...data.independent[0],
        questionId: "other",
      }),
    /blind review question ID mismatch/,
  );
});

test("answer-blind hashes still bind publication to the exact draft and independent answer", () => {
  const data = records();
  const changed = { ...data.candidates[0], answer: "イ" };
  assert.equal(questionDigest(changed), questionDigest(data.candidates[0]));
  assert.throws(() => validate(data, [changed]), /differs from reviewed draft/);
  data.candidates = [changed];
  assert.throws(() => validate(data), /blind answer disagrees/);
  data.candidates[0].blocks = [{ type: "paragraph", text: "変更された問題文" }];
  assert.throws(() => validate(data), /stale author review/);
});

test("mixed benchmark anchors and benchmark-family laundering are rejected in drafts", () => {
  const benchmark = officialCorpus.find((q) => q.pool === "benchmark")!;
  const q = candidate();
  assert.equal(q.source.kind, "generated");
  if (q.source.kind !== "generated") return;
  q.source.referenceQuestionIds.push(benchmark.id);
  assert.throws(
    () => validateCandidate(q, officialCorpus),
    /benchmark reference in study pool/,
  );
  q.source.referenceQuestionIds = [benchmark.id];
  assert.throws(
    () => validateCandidate(q, officialCorpus),
    /benchmark reference in study pool/,
  );
  const familyOnly = { ...candidate(), familyId: benchmark.familyId };
  assert.throws(
    () => validateCandidate(familyOnly, officialCorpus),
    /family pool mismatch/,
  );
  assert.throws(
    () =>
      validateQuestionInventory([
        {
          ...candidate("benchmark-fixture"),
          familyId: "new-family",
          pool: "benchmark",
        },
        { ...candidate(), familyId: "new-family", pool: "study" },
      ]),
    /family pool mismatch/,
  );
  assert.doesNotThrow(() =>
    validateCandidate(
      { ...q, familyId: benchmark.familyId, pool: "benchmark" },
      officialCorpus,
    ),
  );
});

test("the language floors and 500-character B minimum are not weakened", () => {
  const short = { ...candidate(), subject: "B" as const };
  assert.ok(contentText(short).replace(/\s/g, "").length < 500);
  assert.throws(() => validate(records(short)), /insufficient context/);
  const unfamiliar = candidate();
  unfamiliar.blocks = [
    { type: "paragraph", text: "薔薇 鬱 蒼穹 ".repeat(100) },
  ];
  assert.throws(
    () => validate(records(unfamiliar)),
    /word coverage below 90%|kanji coverage below 98%/,
  );
});

test("browser fixtures include every batch's unpublished drafts without an app route", () => {
  sandbox((root) => {
    for (const batch of batches)
      writeRecords(root, batch.id, records(candidate(`${batch.id}-fixture`)));
    const result = cli(root, "./render-content.tsx");
    assert.equal(result.status, 0, result.stderr);
    const fixtures = readJson(root, "tmp/content-fixtures.json");
    assert.equal(
      Object.keys(fixtures).length,
      officialCorpus.length + batches.length,
    );
    for (const batch of batches)
      assert.match(fixtures[`${batch.id}-fixture`], /リスク/);
    for (const bank of batches)
      assert.deepEqual(readJson(root, bank.publishedPath), []);
  });
});
