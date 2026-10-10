import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { questionSchema } from "../src/lib/corpus/schema";
import { readJson } from "./corpus-files";

// Explicit paths keep CLI input out of filesystem paths. Add runtime imports
// alongside new entries; corpus validation checks that both lists agree.
export const batches = [
  {
    id: "pilot-001",
    authoringPath: "data/authoring/pilot-001",
    publishedPath: "data/questions/generated/pilot-001.json",
  },
  {
    id: "batch-002",
    authoringPath: "data/authoring/batch-002",
    publishedPath: "data/questions/generated/batch-002.json",
  },
  {
    id: "batch-003",
    authoringPath: "data/authoring/batch-003",
    publishedPath: "data/questions/generated/batch-003.json",
  },
] as const;
export type BatchId = (typeof batches)[number]["id"];

export function getBatch(id: string = "pilot-001") {
  const batch = batches.find((b) => b.id === id);
  if (!batch)
    throw new Error(
      `Unknown batch ${JSON.stringify(id)}; expected ${batches.map((b) => b.id).join(", ")}`,
    );
  return batch;
}

export function selectBatch(args: string[]) {
  if (args.length > 1) throw new Error("Expected at most one batch ID");
  return getBatch(args[0]);
}

export function readBatchJson<T>(
  id: string,
  file: "questions.json" | "reviews.json" | "independent-review.json",
): T {
  const batch = getBatch(id);
  const path = `${batch.authoringPath}/${file}`;
  if (!existsSync(path))
    throw new Error(
      `${batch.id}: missing ${path}; authoring/review is not complete`,
    );
  return readJson<T>(path);
}

export function readBatch(id: string = "pilot-001") {
  const batch = getBatch(id);
  const questions = questionSchema
    .array()
    .parse(readBatchJson(batch.id, "questions.json"));
  assert.ok(
    questions.length,
    `${batch.id}: no draft questions; authoring is not complete`,
  );
  return questions;
}

export function readPublishedBatches() {
  const entries = readdirSync("data/questions/generated", {
    withFileTypes: true,
  });
  assert.deepEqual(
    entries.map((entry) => entry.name).sort(),
    batches.map((batch) => `${batch.id}.json`).sort(),
    "Generated files must exactly match the registered batches and runtime imports",
  );
  assert.ok(
    entries.every((entry) => entry.isFile()),
    "Generated banks must be regular JSON files",
  );
  return batches.map((batch) => ({
    ...batch,
    questions: questionSchema.array().parse(readJson(batch.publishedPath)),
  }));
}
