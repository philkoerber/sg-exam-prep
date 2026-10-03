"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Layers } from "lucide-react";
import { corpus } from "@/lib/corpus";
import { topics, topicCopy } from "@/lib/corpus/topics";
import type { Question, TopicId } from "@/lib/corpus/schema";
import { practiceQuestions, type Answers } from "@/lib/study";
import { TopicIcon } from "./icons";
import { QuestionView } from "./question-view";
import { Results } from "./results";
import { ConfirmDialog } from "./confirm-dialog";
import { useLanguage, useSessionLanguage } from "./language";

export function Practice() {
  const params = useSearchParams();
  const initial = params.get("topic");
  const [topic, setTopic] = useState<TopicId | "all">(
    topics.some((t) => t.id === initial) ? (initial as TopicId) : "all",
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { language, text } = useLanguage();
  const setup = text.practiceSetup;
  useSessionLanguage(questions.length > 0 && !finished);
  function reset() {
    setQuestions([]);
    setAnswers({});
    setPosition(0);
    setRevealed(false);
    setFinished(false);
    setLeaving(false);
  }
  if (finished)
    return (
      <Results
        questions={questions}
        answers={answers}
        mode="practice"
        onRestart={reset}
      />
    );
  if (!questions.length) {
    const count = corpus.filter(
      (q) => q.pool === "study" && (topic === "all" || q.topic === topic),
    ).length;
    return (
      <div className="page practice-setup">
        <div className="page-heading">
          <div className="eyebrow">{setup.eyebrow}</div>
          <h1>{text.practice}</h1>
          <p>{setup.description}</p>
        </div>
        <fieldset className="topic-selection">
          <legend className="sr-only">{setup.topicLegend}</legend>
          <label className={`all-topics ${topic === "all" ? "selected" : ""}`}>
            <input
              type="radio"
              name="topic"
              checked={topic === "all"}
              onChange={() => setTopic("all")}
            />
            <span className="topic-symbol">
              <Layers size={22} strokeWidth={1.6} />
            </span>
            <div>
              <strong>{text.allTopics}</strong>
              <p>{setup.allDescription}</p>
            </div>
            <span className="topic-count">
              {text.questionCount(
                corpus.filter((q) => q.pool === "study").length,
              )}
            </span>
            <span className="selection-check">
              {topic === "all" && <Check size={15} />}
            </span>
          </label>
          <div className="topic-grid">
            {topics.map((t) => {
              const copy = topicCopy(t.id, language);
              const n = corpus.filter(
                (q) => q.pool === "study" && q.topic === t.id,
              ).length;
              return (
                <label
                  key={t.id}
                  className={`topic-card ${topic === t.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="topic"
                    checked={topic === t.id}
                    onChange={() => setTopic(t.id)}
                    disabled={!n}
                  />
                  <span className="topic-symbol">
                    <TopicIcon name={t.icon} />
                  </span>
                  <span className="selection-check">
                    {topic === t.id && <Check size={15} />}
                  </span>
                  <strong>{copy.name}</strong>
                  <p>{copy.description}</p>
                  <span className="topic-count">{text.questionCount(n)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="start-panel">
          <div>
            <strong>{setup.batch(Math.min(10, count))}</strong>
            <p>{setup.rules}</p>
          </div>
          <button
            className="button primary"
            disabled={!count}
            onClick={() => {
              setQuestions(practiceQuestions(corpus, topic));
              setAnswers({});
            }}
          >
            {setup.start}
            <ArrowRight size={18} />
          </button>
        </div>
        <p className="storage-note">
          {text.sessionLanguage}
          <br />
          {setup.reserved}
        </p>
      </div>
    );
  }
  const q = questions[position];
  return (
    <div className="page session-page" lang="ja">
      <div className="session-heading">
        <button className="back-link" onClick={() => setLeaving(true)}>
          <ArrowLeft size={16} />
          分野選択へ
        </button>
        <span className="session-kind">分野別練習</span>
      </div>
      <div className="session-title">
        <h1>{topic === "all" ? "すべての分野" : topicCopy(topic).name}</h1>
        <span className="question-counter">
          <strong>{String(position + 1).padStart(2, "0")}</strong> /{" "}
          {String(questions.length).padStart(2, "0")}
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${(position / questions.length) * 100}%` }} />
      </div>
      <QuestionView
        key={q.id}
        question={q}
        selected={answers[q.id]}
        onSelect={(key) => setAnswers({ ...answers, [q.id]: key })}
        revealed={revealed}
      />
      <div className="session-actions">
        <span>
          {revealed
            ? "確認できたら、次の一問へ。"
            : "選択肢を選んで、答えを確認。"}
        </span>
        {revealed ? (
          <button
            className="button primary"
            onClick={() => {
              if (position + 1 === questions.length) setFinished(true);
              else {
                setPosition(position + 1);
                setRevealed(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            {position + 1 === questions.length ? "結果を見る" : "次の問題へ"}
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            className="button primary"
            disabled={!answers[q.id]}
            onClick={() => setRevealed(true)}
          >
            答え合わせ
            <Check size={18} />
          </button>
        )}
      </div>
      {leaving && (
        <ConfirmDialog
          title="練習を終了しますか？"
          confirmLabel="終了する"
          onConfirm={reset}
          onCancel={() => setLeaving(false)}
        >
          <p>今回の解答は保存されません。</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
