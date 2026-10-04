import { choiceText } from "../src/lib/corpus/content";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import {
  questionSchema,
  type ContentBlock,
  type Question,
} from "../src/lib/corpus/schema";
import { readQuestions, readJson } from "./corpus-files";

export function questionDigest(q: Question) {
  // The reviewer sees all question data except the proposed answer.
  const { answer: _answer, ...blind } = q;
  void _answer;
  return createHash("sha256").update(JSON.stringify(blind)).digest("hex");
}
export function contentText(q: Question) {
  const blockText = (b: ContentBlock): string => {
    if (b.type === "paragraph") return b.text;
    if (b.type === "panel") return b.paragraphs.join(" ");
    if (b.type === "table")
      return [
        b.caption ?? "",
        ...b.rows.flatMap((r) => r.map((c) => c.text)),
      ].join(" ");
    return b.texts.map((t) => t.text).join(" ");
  };
  return [
    ...q.blocks.map(blockText),
    ...(q.choiceTable?.headers ?? []),
    ...q.choices.map(choiceText),
  ]
    .join(" ")
    .normalize("NFKC")
    .replace(/([A-Za-z])\s+([A-Za-z])/g, "$1$2");
}
const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
export function words(text: string) {
  return [...segmenter.segment(text)]
    .filter(
      (s) =>
        s.isWordLike &&
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(
          s.segment,
        ),
    )
    .map((s) => s.segment);
}
export function languageMetrics(q: Question, baseline: Question[]) {
  const text = contentText(q);
  const baseText = baseline.map(contentText).join(" ");
  const vocabulary = new Set(words(baseText));
  const characters = new Set(baseText.match(/\p{Script=Han}/gu) ?? []);
  const tokens = words(text);
  const kanji = text.match(/\p{Script=Han}/gu) ?? [];
  const novelWords = [
    ...new Set(tokens.filter((s) => !vocabulary.has(s))),
  ].sort();
  const novelKanji = [
    ...new Set(kanji.filter((s) => !characters.has(s))),
  ].sort();
  return {
    characters: text.replace(/\s/g, "").length,
    wordCoverage: tokens.length
      ? 1 - tokens.filter((s) => !vocabulary.has(s)).length / tokens.length
      : 1,
    kanjiCoverage: kanji.length
      ? 1 - kanji.filter((s) => !characters.has(s)).length / kanji.length
      : 1,
    novelWords,
    novelKanji,
  };
}

export const pilotPath = "data/authoring/pilot-001";
export function readPilot() {
  return questionSchema.array().parse(readJson(`${pilotPath}/questions.json`));
}
export function writePilotReport() {
  const official = readQuestions("data/questions/official");
  const pilot = readPilot();
  const report = pilot.map((q) => ({
    questionId: q.id,
    contentHash: questionDigest(q),
    ...languageMetrics(q, official),
  }));
  writeFileSync(
    `${pilotPath}/language-report.json`,
    JSON.stringify(
      {
        baseline:
          "120 official questions, rendered body and choices; no generated text",
        method:
          "Node Intl.Segmenter ja; token overlap is a screening measure, not a proficiency or grammar score. Numbers, Latin-only tokens and punctuation excluded; inflections are not lemmatized.",
        minimumWordCoverage: 0.9,
        minimumKanjiCoverage: 0.98,
        kanjiTarget: 0.99,
        note: "All unfamiliar words/kanji require review; the 98% per-question floor allows necessary technical terms. Target overall kanji overlap is at least 99%.",
        questions: report,
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    `${pilotPath}/blind-review.json`,
    JSON.stringify(
      pilot.map((q) => {
        const { answer: _answer, ...blind } = q;
        void _answer;
        return { ...blind, contentHash: questionDigest(q) };
      }),
      null,
      2,
    ) + "\n",
  );
  for (const r of report)
    console.log(
      r.questionId,
      `${(100 * r.wordCoverage).toFixed(1)}% words`,
      `${(100 * r.kanjiCoverage).toFixed(1)}% kanji`,
      r.novelWords.join(" / "),
      r.novelKanji.join(""),
    );
}
