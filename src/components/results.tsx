"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Check, X, ChevronDown } from "lucide-react";
import { score, type Answers } from "@/lib/study";
import type { Question } from "@/lib/corpus/schema";
import { topics, topicName } from "@/lib/corpus/topics";
import { QuestionView } from "./question-view";

export function Results({
  questions,
  answers,
  mode,
  onRestart,
}: {
  questions: Question[];
  answers: Answers;
  mode: "practice" | "exam";
  onRestart: () => void;
}) {
  const result = score(questions, answers);
  const [filter, setFilter] = useState<"all" | "wrong">("wrong");
  const [open, setOpen] = useState<string | null>(null);
  const visible = questions.filter(
    (q) => filter === "all" || answers[q.id] !== q.answer,
  );
  return (
    <div className="page results-page">
      <div className="page-heading">
        <div className="eyebrow">今回の振り返り</div>
        <h1>おつかれさまでした。</h1>
        <p>答えを振り返って、次の理解につなげましょう。</p>
      </div>
      <div className="result-hero">
        <div>
          <span className="result-label">正答率</span>
          <div className="result-percent">
            {result.percent}
            <span>%</span>
          </div>
        </div>
        <div className="result-summary">
          <strong>
            {result.correct}
            <span> / {result.total} 問正解</span>
          </strong>
          <p>
            解答済み {result.answered}問 · 未解答{" "}
            {result.total - result.answered}問
          </p>
          {mode === "exam" && (
            <p className="small muted">
              正答率は学習の目安です。IPAの公式スコアや合否を示すものではありません。
            </p>
          )}
        </div>
      </div>
      <div className="breakdown">
        <h2>分野ごとの結果</h2>
        {topics.map((t) => {
          const qs = questions.filter((q) => q.topic === t.id);
          if (!qs.length) return null;
          const s = score(qs, answers);
          return (
            <div className="breakdown-row" key={t.id}>
              <span>{t.name}</span>
              <div className="bar">
                <i style={{ width: `${s.percent}%` }} />
              </div>
              <span>
                {s.correct} / {s.total}
              </span>
            </div>
          );
        })}
        {mode === "exam" && (
          <div className="subject-results">
            {(["A", "B"] as const).map((subject) => {
              const s = score(
                questions.filter((q) => q.subject === subject),
                answers,
              );
              return (
                <span key={subject}>
                  科目{subject}：{s.correct} / {s.total}問
                </span>
              );
            })}
          </div>
        )}
      </div>
      <section className="review-section">
        <div className="section-heading">
          <h2>問題を振り返る</h2>
          <div className="segmented" aria-label="復習する問題">
            <button
              className={filter === "wrong" ? "active" : ""}
              onClick={() => setFilter("wrong")}
            >
              間違い・未解答
            </button>
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              すべて
            </button>
          </div>
        </div>
        {!visible.length && (
          <div className="all-correct">
            <Check size={22} />
            すべて正解です。この調子で続けましょう。
          </div>
        )}
        {visible.map((q) => (
          <div className="review-item" key={q.id}>
            <button
              className="review-toggle"
              aria-expanded={open === q.id}
              onClick={() => setOpen(open === q.id ? null : q.id)}
            >
              {answers[q.id] === q.answer ? (
                <Check className="text-green" size={19} />
              ) : (
                <X className="text-red" size={19} />
              )}
              <span>
                第{questions.indexOf(q) + 1}問
                <small>{topicName(q.topic)}</small>
              </span>
              <span className="review-answer">
                {answers[q.id] || "未解答"} → {q.answer}
              </span>
              <ChevronDown size={18} />
            </button>
            {open === q.id && (
              <QuestionView question={q} selected={answers[q.id]} revealed />
            )}
          </div>
        ))}
      </section>
      <div className="result-actions">
        <button className="button primary" onClick={onRestart}>
          <RotateCcw size={17} />
          {mode === "exam" ? "試験設定に戻る" : "分野を選び直す"}
        </button>
        <Link className="button secondary" href="/">
          ホームに戻る
          <ArrowRight size={17} />
        </Link>
      </div>
      <p className="storage-note">
        結果は保存されません。画面を離れると消えます。
      </p>
    </div>
  );
}
