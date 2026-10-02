import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const destination = "jpdb/generated";
mkdirSync(destination, { recursive: true });
const files = readdirSync("data/extracted")
  .filter((f) => /^201.*_qs\.txt$/.test(f))
  .sort();
if (!files.length)
  throw new Error("Run scripts/corpus/extract-history.py first.");
const manifest: {
  input: string;
  output: string;
  characters: number;
  sha256: string;
}[] = [];
for (const file of files) {
  const raw = readFileSync(`data/extracted/${file}`, "utf8");
  // Preserve the original exam vocabulary. Remove only page numbers and empty lines.
  const text = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !/^[－—−\-\s]*\d+[－—−\-\s]*$/.test(line))
    .join("\n");
  // Small text files make JPDB's native text importer easy to use. No account/API required.
  const lines = text.split("\n");
  const chunks: string[] = [];
  let chunk = "";
  for (const line of lines) {
    if (chunk.length + line.length > 25000) {
      chunks.push(chunk);
      chunk = "";
    }
    chunk += line + "\n";
  }
  if (chunk) chunks.push(chunk);
  chunks.forEach((part, i) => {
    const output = `${file.replace("_qs.txt", "")}${chunks.length > 1 ? `-part-${i + 1}` : ""}.txt`;
    writeFileSync(`${destination}/${output}`, part);
    manifest.push({
      input: file,
      output,
      characters: part.length,
      sha256: createHash("sha256").update(part).digest("hex"),
    });
  });
}
writeFileSync(
  `${destination}/manifest.json`,
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Generated ${manifest.length} JPDB text-import files from ${files.length} historical papers.`,
);
