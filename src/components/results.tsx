"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Check, X, ChevronDown } from "lucide-react";
import { score, type Answers } from "@/lib/study";
import type { Question } from "@/lib/corpus/schema";
import { topics, topicCopy } from "@/lib/corpus/topics";
import { QuestionView } from "./question-view";
import { useLanguage } from "./language";

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
  const { language, text } = useLanguage();
  const copy = text.results;
  const result = score(questions, answers);
  const [filter, setFilter] = useState<"all" | "wrong">("wrong");
  const [open, setOpen] = useState<string | null>(null);
  const visible = questions.filter(
    (q) => filter === "all" || answers[q.id] !== q.answer,
  );
  return (
    <div className="page results-page">
      <div className="page-heading">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.heading}</h1>
        <p>{copy.description}</p>
      </div>
      <div className="result-hero">
        <div>
          <span className="result-label">{copy.accuracy}</span>
          <div className="result-percent">
            {result.percent}
            <span>%</span>
          </div>
        </div>
        <div className="result-summary">
          <strong>
            {result.correct}
            <span>{copy.correctTotal(result.total)}</span>
          </strong>
          <p>
            {copy.answered(result.answered, result.total - result.answered)}
          </p>
          {mode === "exam" && <p className="small muted">{copy.disclaimer}</p>}
        </div>
      </div>
      <div className="breakdown">
        <h2>{copy.breakdown}</h2>
        {topics.map((t) => {
          const qs = questions.filter((q) => q.topic === t.id);
          if (!qs.length) return null;
          const s = score(qs, answers);
          return (
            <div className="breakdown-row" key={t.id}>
              <span>{topicCopy(t.id, language).name}</span>
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
                  {text.subject(subject)}：{s.correct} /{" "}
                  {text.questionCount(s.total)}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <section className="review-section">
        <div className="section-heading">
          <h2>{copy.review}</h2>
          <div className="segmented" aria-label={copy.filterLabel}>
            <button
              className={filter === "wrong" ? "active" : ""}
              onClick={() => setFilter("wrong")}
            >
              {copy.wrong}
            </button>
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              {copy.all}
            </button>
          </div>
        </div>
        {!visible.length && (
          <div className="all-correct">
            <Check size={22} />
            {copy.allCorrect}
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
                {text.questionNumber(questions.indexOf(q) + 1)}
                <small>{topicCopy(q.topic, language).name}</small>
              </span>
              <span className="review-answer">
                <span lang={answers[q.id] ? "ja" : undefined}>
                  {answers[q.id] || text.unanswered}
                </span>{" "}
                → <span lang="ja">{q.answer}</span>
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
          {mode === "exam" ? copy.examRestart : copy.practiceRestart}
        </button>
        <Link className="button secondary" href="/">
          {text.homeLink}
          <ArrowRight size={17} />
        </Link>
      </div>
      <p className="storage-note">{copy.noSave}</p>
    </div>
  );
}
