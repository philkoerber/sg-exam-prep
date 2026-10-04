import { writeFileSync } from "node:fs";
import { readJson, readQuestions } from "./corpus-files";
import { pilotPath, readPilot } from "./pilot-review";
import {
  validateApproval,
  type Review,
  type BlindReview,
} from "./validate-pilot";
const official = readQuestions("data/questions/official");
const candidates = readPilot();
const reviews = readJson<Review[]>(`${pilotPath}/reviews.json`);
const independent = readJson<BlindReview[]>(
  `${pilotPath}/independent-review.json`,
);
// Fail before writing anything when any approval is stale or missing.
for (const q of candidates)
  validateApproval(
    q,
    official,
    reviews.find((r) => r.questionId === q.id),
    independent.find((r) => r.questionId === q.id),
  );
writeFileSync(
  "data/questions/generated/pilot-001.json",
  JSON.stringify(candidates, null, 2) + "\n",
);
console.log(`Published ${candidates.length} reviewed questions.`);
