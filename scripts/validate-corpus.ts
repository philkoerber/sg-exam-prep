import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { readQuestions, readJson } from "./corpus-files";
import { questionBlocks } from "../src/lib/corpus/content";
import { contentBlockSchema } from "../src/lib/corpus/schema";
import { validatePublishedPilot } from "./validate-pilot";

const official = readQuestions("data/questions/official");
const generated = readQuestions("data/questions/generated");
const all = [...official, ...generated];
if (new Set(all.map((q) => q.id)).size !== all.length)
  throw new Error("Duplicate question IDs");
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
validatePublishedPilot(generated, official);
console.log(
  `Validated ${official.length} official + ${generated.length} generated questions, native blocks, provenance, review records and ${manifest.length + resources.length} source checksums.`,
);
