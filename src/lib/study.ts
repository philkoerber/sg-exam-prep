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
  random = Math.random,
) {
  return selectFamilies(
    corpus.filter(
      (q) => q.pool === "study" && (topic === "all" || q.topic === topic),
    ),
    count,
    random,
  );
}

function selectFamilies(
  questions: Question[],
  count: number,
  random = Math.random,
) {
  const families = new Map<string, Question[]>();
  for (const q of questions) {
    const members = families.get(q.familyId) ?? [];
    members.push(q);
    families.set(q.familyId, members);
  }
  // Sample families uniformly, then a member. Large generated families must
  // not become more likely than a family with a single official question.
  return shuffle([...families.values()], random)
    .slice(0, count)
    .map((members) => members[Math.floor(random() * members.length)]);
}
export function examQuestions(corpus: Question[], random = Math.random) {
  // Use current-format questions only; legacy papers are not interchangeable with CBT.
  const pool = corpus.filter(
    (q) => q.source.kind !== "official" || q.source.era !== "legacy",
  );
  const a = selectFamilies(
    pool.filter((q) => q.subject === "A"),
    EXAM_A_COUNT,
    random,
  );
  const used = new Set(a.map((q) => q.familyId));
  const b = selectFamilies(
    pool.filter((q) => q.subject === "B" && !used.has(q.familyId)),
    EXAM_B_COUNT,
    random,
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
