import assert from "node:assert/strict";
import { test } from "node:test";
import { readBatch } from "../scripts/corpus-batches";
import {
  contentText,
  languageMetrics,
  readPilot,
} from "../scripts/pilot-review";
import { officialCorpus, generatedBanks } from "../src/lib/corpus";
import { questionBlocks } from "../src/lib/corpus/content";

const expectedAnchors = {
  "batch-002": [
    "sg-2024-public-01",
    "sg-2024-public-02",
    "sg-2022-sample-12",
    "sg-2023-public-07",
    "sg-2025-public-06",
    "sg-2022-sample-25",
    "sg-2022-sample-30",
    "sg-2023-public-02",
    "sg-2023-public-04",
    "sg-2022-sample-31",
    "sg-2023-public-08",
    "sg-2022-sample-39",
    "sg-2024-public-09",
    "sg-2023-public-10",
    "sg-2024-public-08",
    "sg-2023-public-12",
    "sg-2022-sample-51",
    "sg-2022-sample-53",
    "sg-2022-sample-57",
    "sg-2025-public-15",
  ],
  "batch-003": [
    "sg-2025-public-01",
    "sg-2022-sample-15",
    "sg-2024-public-04",
    "sg-2022-sample-07",
    "sg-2022-sample-09",
    "sg-2025-public-03",
    "sg-2022-sample-35",
    "sg-2023-public-09",
    "sg-2022-sample-32",
    "sg-2022-sample-37",
    "sg-2022-sample-46",
    "sg-2022-sample-48",
    "sg-2023-public-11",
    "sg-2024-public-11",
    "sg-2025-public-11",
    "sg-2025-public-12",
    "sg-2022-sample-60",
    "sg-2022-sample-59",
    "sg-2023-public-15",
    "sg-2024-public-15",
  ],
} as const;

const first = readBatch("batch-002");
const second = readBatch("batch-003");

test("the two published expansions retain exactly the planned 40 study anchors", () => {
  const pilotFamilies = new Set(readPilot().map((q) => q.familyId));
  const families = new Set<string>();
  for (const id of ["batch-002", "batch-003"] as const) {
    const questions = readBatch(id);
    assert.equal(questions.length, 20);
    assert.deepEqual(generatedBanks[id], questions);
    questions.forEach((q, i) => {
      assert.equal(
        q.id,
        `sg-generated-${id}-${String(i + 1).padStart(3, "0")}`,
      );
      assert.equal(q.subject, i < 16 ? "A" : "B");
      assert.equal(q.pool, "study");
      assert.equal(q.source.kind, "generated");
      if (q.source.kind !== "generated") throw new Error("Expected generated");
      assert.deepEqual(q.source.referenceQuestionIds, [expectedAnchors[id][i]]);
      const anchor = officialCorpus.find(
        (o) => o.id === expectedAnchors[id][i],
      )!;
      for (const field of ["familyId", "subject", "topic", "pool"] as const)
        assert.equal(q[field], anchor[field]);
      assert.equal(pilotFamilies.has(q.familyId), false);
      assert.equal(families.has(q.familyId), false);
      families.add(q.familyId);
      assert.ok(
        q.source.references.some((r) => r.resourceId !== "ipa-sg-syllabus-4.1"),
      );
    });
  }
  assert.equal(families.size, 40);
  assert.equal(generatedBanks["pilot-001"].length, 0);
});

test("expansion language and source-shaped case formats stay within the reviewed scope", () => {
  assert.equal(officialCorpus.length, 120);
  for (const q of [...first, ...second]) {
    const metrics = languageMetrics(q, officialCorpus);
    assert.ok(metrics.wordCoverage >= 0.95, q.id);
    // 真正 is the documented statutory-language exception, not padded away.
    const floor = q.id === "sg-generated-batch-002-011" ? 0.98 : 0.99;
    assert.ok(metrics.kanjiCoverage >= floor, q.id);
    if (q.subject === "B") assert.ok(metrics.characters >= 500, q.id);
  }
  assert.equal(first[16].choices.length, 10);
  assert.equal(first[17].blocks.filter((b) => b.type === "diagram").length, 1);
  assert.deepEqual(first[18].choiceTable?.headers, ["評価結果", "評価根拠"]);
  assert.equal(first[19].blocks.filter((b) => b.type === "table").length, 3);
  assert.equal(first[19].choices.length, 10);
  assert.equal(first[19].choiceTable?.headers.length, 3);
  assert.equal(second[11].blocks.filter((b) => b.type === "table").length, 2);
  assert.equal(second[15].blocks.filter((b) => b.type === "table").length, 1);
  assert.equal(second[16].choices.length, 10);
  const rights = second[17].blocks.find((b) => b.type === "table");
  assert.ok(rights?.type === "table" && rights.headerRows === 2);
  const timing = second[18].blocks.find((b) => b.type === "panel");
  assert.ok(timing?.type === "panel" && timing.paragraphs.length === 11);
  for (const q of [...first, ...second]) {
    assert.ok(contentText(q).length);
    for (const b of questionBlocks(q)) {
      if (b.type === "table")
        assert.ok(
          Math.abs(b.columns.reduce((sum, n) => sum + n, 0) - 100) < 1e-8,
        );
    }
  }
});

test("the new financial question is solved from its displayed statement values", () => {
  const q = second[11];
  const values = new Map<string, number>();
  for (const block of q.blocks) {
    if (block.type !== "table") continue;
    for (const row of block.rows) {
      if (row.length !== 2 || !row[1].text.trim()) continue;
      const value = Number(row[1].text.replaceAll(",", ""));
      if (Number.isFinite(value)) values.set(row[0].text, value);
    }
  }
  const value = (label: string) => {
    assert.ok(values.has(label), label);
    return values.get(label)!;
  };
  const expense = value("材料費") + value("労務費") + value("経費");
  const manufacturing =
    expense + value("期首仕掛品棚卸高") - value("期末仕掛品棚卸高");
  const salesCost =
    manufacturing + value("期首製品棚卸高") - value("期末製品棚卸高");
  const profit = value("売上高") - salesCost;
  const matching = q.choices.filter((c) => Number(c.text) === profit);
  assert.equal(matching.length, 1);
  assert.equal(q.answer, matching[0].key);
  const distractorValues = [
    value("売上高") -
      (expense + value("期首製品棚卸高") - value("期末製品棚卸高")),
    value("売上高") - manufacturing,
    value("売上高") -
      (manufacturing - value("期首製品棚卸高") + value("期末製品棚卸高")),
  ];
  assert.deepEqual(
    q.choices
      .filter((c) => c.key !== q.answer)
      .map((c) => Number(c.text))
      .sort((a, b) => a - b),
    distractorValues.sort((a, b) => a - b),
  );
});
