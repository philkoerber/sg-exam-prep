import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { readQuestions, readJson } from "./corpus-files";
import { questionBlocks } from "../src/lib/corpus/content";
import { contentBlockSchema } from "../src/lib/corpus/schema";
import { generatedBanks, officialCorpus } from "../src/lib/corpus";
import { batches, readPublishedBatches } from "./corpus-batches";
import {
  readBatchRecords,
  validatePublishedBatch,
  validateQuestionInventory,
} from "./validate-pilot";

const official = readQuestions("data/questions/official");
const banks = readPublishedBatches();
assert.deepEqual(
  Object.keys(generatedBanks).sort(),
  batches.map((b) => b.id).sort(),
  "Runtime banks must match the batch registry",
);
assert.deepEqual(
  official,
  officialCorpus,
  "Official files must match the fixed runtime baseline",
);
for (const bank of banks)
  assert.deepEqual(
    bank.questions,
    generatedBanks[bank.id],
    `${bank.id}: runtime import differs from published file`,
  );
const generated = banks.flatMap((bank) => bank.questions);
const all = [...official, ...generated];
validateQuestionInventory(all);
const drafts = banks.flatMap((bank) => {
  const records = readBatchRecords(bank.id, bank.questions.length > 0);
  validatePublishedBatch(bank.id, bank.questions, official, records);
  return records.candidates;
});
validateQuestionInventory([...official, ...drafts]);
if (
  official.some((q) => q.source.kind !== "official") ||
  generated.some((q) => q.source.kind !== "generated")
)
  throw new Error("Question stored under the wrong source kind");
for (const q of all)
  questionBlocks(q).forEach((block) => contentBlockSchema.parse(block));
const manifest = readJson<{ file: string; sha256: string }[]>(
  "data/sources/manifest.json",
);
const resources = readJson<{ file: string; sha256: string }[]>(
  "data/resources/catalog.json",
);
for (const source of [
  ...manifest.map((s) => ({ ...s, file: `data/sources/${s.file}` })),
  ...resources,
]) {
  const hash = createHash("sha256")
    .update(readFileSync(source.file))
    .digest("hex");
  if (hash !== source.sha256)
    throw new Error(`Source checksum mismatch: ${source.file}`);
}
console.log(
  `Validated ${official.length} official + ${generated.length} generated questions, ${drafts.length} drafts across ${banks.length} batches, native blocks, provenance, review records and ${manifest.length + resources.length} source checksums.`,
);
