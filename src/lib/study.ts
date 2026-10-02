import type { Question, TopicId } from "./corpus/schema";

export const EXAM_DURATION_MS = 120 * 60 * 1000;
export const EXAM_A_COUNT = 48;
export const EXAM_B_COUNT = 12;
export type Answers = Record<string, string>;

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function practiceQuestions(
  corpus: Question[],
  topic: TopicId | "all",
  count = 10,
) {
  return shuffle(
    corpus.filter(
      (q) => q.pool === "study" && (topic === "all" || q.topic === topic),
    ),
  ).slice(0, count);
}
export function examQuestions(corpus: Question[]) {
  // Use current-format questions only; legacy papers are not interchangeable with CBT.
  const pool = corpus.filter((q) => q.era !== "legacy");
  const a = shuffle(pool.filter((q) => q.subject === "A")).slice(
    0,
    EXAM_A_COUNT,
  );
  const b = shuffle(pool.filter((q) => q.subject === "B")).slice(
    0,
    EXAM_B_COUNT,
  );
  if (a.length !== EXAM_A_COUNT || b.length !== EXAM_B_COUNT)
    throw new Error("模擬試験に必要な問題が不足しています。");
  return [...a, ...b];
}
export function score(questions: Question[], answers: Answers) {
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  const answered = questions.filter((q) =>
    q.choices.some((c) => c.key === answers[q.id]),
  ).length;
  return {
    correct,
    answered,
    total: questions.length,
    percent: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
  };
}
export function remainingSeconds(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
export function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}
