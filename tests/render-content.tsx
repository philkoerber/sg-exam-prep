import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { officialCorpus } from "../src/lib/corpus";
import { readPilot } from "../scripts/pilot-review";
import { QuestionView } from "../src/components/question-view";
import { LanguageProvider } from "../src/components/language";

// Also render unpublished candidates, without exposing a draft route in the app.
const fixtures = Object.fromEntries(
  [...officialCorpus, ...readPilot()].map((q) => [
    q.id,
    renderToStaticMarkup(
      <LanguageProvider>
        <QuestionView question={q} />
      </LanguageProvider>,
    ),
  ]),
);
mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/content-fixtures.json", JSON.stringify(fixtures));
