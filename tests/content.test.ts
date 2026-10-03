import { test } from "node:test";
import assert from "node:assert/strict";
import { corpus } from "../src/lib/corpus";
import { contentBlockSchema } from "../src/lib/corpus/schema";

test("every former picture has native content and no raster references remain", () => {
  const blocks = corpus
    .filter((q) => q.display === "structured")
    .flatMap((q) => q.blocks);
  assert.equal(blocks.filter((b) => b.type === "table").length, 36);
  assert.equal(blocks.filter((b) => b.type === "panel").length, 18);
  assert.equal(blocks.filter((b) => b.type === "diagram").length, 2);
  assert.doesNotMatch(
    JSON.stringify(corpus),
    /question-assets|\.webp|\.png|data:image/,
  );
  blocks.forEach((block) => contentBlockSchema.parse(block));
});

test("financial statements preserve all five blank answer boxes", () => {
  const q = corpus.find((q) => q.id === "sg-2022-sample-48")!;
  const tables = q.blocks.filter((b) => b.type === "table");
  assert.equal(tables.length, 2);
  assert.equal(
    tables.flatMap((t) => t.rows.flat()).filter((c) => c.blank).length,
    5,
  );
  assert.equal(q.answer, "ア");
});

test("converted answer tables retain their official choice order", () => {
  for (const q of corpus) {
    for (const table of q.blocks.filter((b) => b.type === "table")) {
      const keys = table.rows
        .slice(table.headerRows)
        .map((row) => row[0]?.text);
      if (keys[0] === "ア") {
        assert.deepEqual(
          keys,
          q.choices.map((c) => c.key),
          q.id,
        );
        assert.ok(keys.includes(q.answer));
      }
    }
  }
});

test("SVG text and geometry remain inside a usable viewBox", () => {
  for (const q of corpus) {
    for (const diagram of q.blocks.filter((b) => b.type === "diagram")) {
      const [x, y, width, height] = diagram.viewBox;
      for (const text of diagram.texts) {
        assert.ok(
          text.x >= x - 1 && text.x + text.width <= x + width + 1,
          `${q.id}: ${text.text} x`,
        );
        assert.ok(
          text.y >= y && text.y <= y + height + 2,
          `${q.id}: ${text.text} y`,
        );
      }
    }
  }
});

test("invalid merged cell grids are rejected", () => {
  const table = {
    type: "table",
    columns: [50, 50],
    headerRows: 1,
    rows: [
      [{ text: "header", colSpan: 2, rowSpan: 1 }],
      [{ text: "out of bounds", colSpan: 3, rowSpan: 1 }],
    ],
  };
  assert.equal(contentBlockSchema.safeParse(table).success, false);
  table.rows[1][0].colSpan = 1;
  assert.equal(contentBlockSchema.safeParse(table).success, false);
});
