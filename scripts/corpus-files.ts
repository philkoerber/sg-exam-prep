import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { questionSchema } from "../src/lib/corpus/schema";

export function readQuestions(directory: string) {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .flatMap((file) =>
      questionSchema
        .array()
        .parse(JSON.parse(readFileSync(join(directory, file), "utf8"))),
    );
}
export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}
