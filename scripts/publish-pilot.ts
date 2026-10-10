import { writeFileSync } from "node:fs";
import { readQuestions } from "./corpus-files";
import { readPublishedBatches, selectBatch } from "./corpus-batches";
import {
  readBatchRecords,
  validatePublishedBatch,
  validateQuestionInventory,
} from "./validate-pilot";

const batch = selectBatch(process.argv.slice(2));
const official = readQuestions("data/questions/official");
const banks = readPublishedBatches();
const records = readBatchRecords(batch.id, true);
// Fail before writing anything when any approval is stale or missing. Only the
// selected batch is published; drafts in other batches need not be finished.
validatePublishedBatch(batch.id, records.candidates, official, records);
validateQuestionInventory([
  ...official,
  ...banks.flatMap((bank) =>
    bank.id === batch.id ? records.candidates : bank.questions,
  ),
]);
writeFileSync(
  batch.publishedPath,
  JSON.stringify(records.candidates, null, 2) + "\n",
);
console.log(
  `Published ${records.candidates.length} reviewed questions (${batch.id}).`,
);
