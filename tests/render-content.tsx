import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { corpus } from "../src/lib/corpus";
import { QuestionContent } from "../src/components/question-content";

// Exercise the production renderer for every question, without adding a test route.
const fixtures = Object.fromEntries(
  corpus
    .filter((q) => q.display === "structured")
    .map((q) => [
      q.id,
      q.blocks
        .map((block, i) =>
          renderToStaticMarkup(
            <QuestionContent block={block} label={`${q.id}-${i}`} />,
          ),
        )
        .join(""),
    ]),
);
mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/content-fixtures.json", JSON.stringify(fixtures));
