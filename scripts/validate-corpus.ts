import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { questionSchema, type Question } from "../src/lib/corpus/schema";
const all: Question[] = readdirSync("data/questions")
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) =>
    JSON.parse(readFileSync(`data/questions/${f}`, "utf8")).map((q: unknown) =>
      questionSchema.parse(q),
    ),
  );
if (new Set(all.map((q) => q.id)).size !== all.length)
  throw new Error("Duplicate question IDs");
for (const q of all)
  for (const image of q.images)
    if (!existsSync(`public${image.src}`))
      throw new Error(`Missing ${image.src}`);
for (const q of all)
  for (const block of q.blocks)
    if (block.type === "figure" && !existsSync(`public${block.src}`))
      throw new Error(`Missing ${block.src}`);
const manifest: { file: string; sha256: string }[] = JSON.parse(
  readFileSync("data/sources/manifest.json", "utf8"),
);
for (const source of manifest) {
  const hash = createHash("sha256")
    .update(readFileSync(`data/sources/${source.file}`))
    .digest("hex");
  if (hash !== source.sha256)
    throw new Error(`Source checksum mismatch: ${source.file}`);
}
console.log(
  `Validated ${all.length} questions, original images, and ${manifest.length} source checksums.`,
);
