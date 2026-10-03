"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Timer,
  ClipboardCheck,
  Check,
  Info,
} from "lucide-react";
import { corpus } from "@/lib/corpus";
import type { Question } from "@/lib/corpus/schema";
import {
  EXAM_DURATION_MS,
  examQuestions,
  remainingSeconds,
  formatTime,
  type Answers,
} from "@/lib/study";
import { QuestionView } from "./question-view";
import { Results } from "./results";
import { ConfirmDialog } from "./confirm-dialog";
import { useLanguage, useSessionLanguage } from "./language";

export function Exam() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [position, setPosition] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [seconds, setSeconds] = useState(EXAM_DURATION_MS / 1000);
  const [finished, setFinished] = useState(false);
  const [confirm, setConfirm] = useState<"submit" | "leave" | null>(null);
  const [error, setError] = useState(false);
  const { text } = useLanguage();
  const setup = text.examSetup;
  useSessionLanguage(questions.length > 0 && !finished);
  useEffect(() => {
    if (!deadline || finished) return;
    const tick = () => {
      const remaining = remainingSeconds(deadline, Date.now());
      setSeconds(remaining);
      if (!remaining) {
        setFinished(true);
        setConfirm(null);
      }
    };
    const interval = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [deadline, finished]);
  function reset() {
    setQuestions([]);
    setAnswers({});
    setPosition(0);
    setDeadline(0);
    setSeconds(EXAM_DURATION_MS / 1000);
    setFinished(false);
    setConfirm(null);
  }
  function go(index: number) {
    setPosition(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function start() {
    try {
      setQuestions(examQuestions(corpus));
      setAnswers({});
      setPosition(0);
      setDeadline(Date.now() + EXAM_DURATION_MS);
      setSeconds(EXAM_DURATION_MS / 1000);
      setError(false);
    } catch {
      setError(true);
    }
  }
  if (finished)
    return (
      <Results
        questions={questions}
        answers={answers}
        mode="exam"
        onRestart={reset}
      />
    );
  if (!questions.length)
    return (
      <div className="page exam-setup">
        <div className="page-heading">
          <div className="eyebrow">{setup.eyebrow}</div>
          <h1>{text.exam}</h1>
          <p>{setup.description}</p>
        </div>
        <div className="exam-intro">
          <div className="exam-intro-icon">
            <ClipboardCheck size={35} strokeWidth={1.3} />
          </div>
          <h2>{setup.heading}</h2>
          <p>{setup.source}</p>
          <div className="exam-specs">
            <div>
              <strong>
                60<span>{setup.questionsUnit}</span>
              </strong>
              <span>{setup.questionCount}</span>
            </div>
            <div>
              <strong>
                120<span>{setup.minutesUnit}</span>
              </strong>
              <span>{setup.timeLimit}</span>
            </div>
            <div>
              <strong>
                48<span> + </span>12
              </strong>
              <span>{setup.subjects}</span>
            </div>
          </div>
          <div className="exam-rules">
            <h3>{setup.beforeStart}</h3>
            <p>
              <Check size={17} />
              {setup.changeAnswers}
            </p>
            <p>
              <Check size={17} />
              {setup.resultsAfter}
            </p>
            <p>
              <Check size={17} />
              {setup.autoSubmit}
            </p>
            <p>
              <Info size={17} />
              {setup.noSave}
            </p>
            <p>
              <Info size={17} />
              {text.sessionLanguage}
            </p>
          </div>
          <div className="exam-start">
            <button className="button primary" onClick={start}>
              <Timer size={18} />
              {setup.start}
              <ArrowRight size={18} />
            </button>
            {error && (
              <p role="alert" className="text-red">
                {setup.error}
              </p>
            )}
            <span>{setup.timerStarts}</span>
          </div>
        </div>
        <p className="storage-note">{setup.disclaimer}</p>
      </div>
    );
  const q = questions[position];
  const answered = Object.keys(answers).length;
  return (
    <div className="page exam-session" lang="ja">
      <div className="session-heading">
        <button className="back-link" onClick={() => setConfirm("leave")}>
          <ArrowLeft size={16} />
          試験を終了
        </button>
        <span className="session-kind">模擬試験</span>
        <div className={`exam-timer ${seconds <= 300 ? "urgent" : ""}`}>
          <Timer size={18} />
          <span>残り</span>
          <output aria-label="残り時間">{formatTime(seconds)}</output>
        </div>
      </div>
      <div className="exam-layout">
        <div className="exam-main">
          <div className="session-title">
            <h1>
              第{position + 1}問
              <span className="subject-label">科目{q.subject}</span>
            </h1>
            <span className="question-counter">
              <strong>{answered}</strong> / 60 問解答
            </span>
          </div>
          <div className="progress-track">
            <div style={{ width: `${(answered / 60) * 100}%` }} />
          </div>
          <QuestionView
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onSelect={(key) => {
              if (Date.now() >= deadline) {
                setFinished(true);
                setConfirm(null);
                return;
              }
              setAnswers({ ...answers, [q.id]: key });
            }}
          />
          <div className="exam-pagination">
            <button
              className="button secondary"
              disabled={position === 0}
              onClick={() => go(position - 1)}
            >
              <ArrowLeft size={17} />
              前の問題
            </button>
            {position < questions.length - 1 ? (
              <button
                className="button primary"
                onClick={() => go(position + 1)}
              >
                次の問題
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="button primary"
                onClick={() => setConfirm("submit")}
              >
                解答を提出
                <Check size={17} />
              </button>
            )}
          </div>
        </div>
        <aside className="exam-sidebar">
          <div className="question-map">
            <h2>
              解答状況<span>{answered} / 60</span>
            </h2>
            <div className="map-legend">
              <span>
                <i />
                未解答
              </span>
              <span>
                <i className="done" />
                解答済み
              </span>
            </div>
            {(["A", "B"] as const).map((subject) => (
              <div className="map-section" key={subject}>
                <h3>科目{subject}</h3>
                <div className="map-grid">
                  {questions.map(
                    (item, i) =>
                      item.subject === subject && (
                        <button
                          key={item.id}
                          aria-label={`第${i + 1}問 ${answers[item.id] ? "解答済み" : "未解答"}`}
                          aria-current={position === i ? "step" : undefined}
                          className={`${answers[item.id] ? "answered" : ""} ${position === i ? "current" : ""}`}
                          onClick={() => go(i)}
                        >
                          {i + 1}
                        </button>
                      ),
                  )}
                </div>
              </div>
            ))}
            <button
              className="button submit-button"
              onClick={() => setConfirm("submit")}
            >
              提出して採点する
              <ArrowRight size={16} />
            </button>
            <p>提出するまで正解は表示されません。</p>
          </div>
        </aside>
      </div>
      {confirm && (
        <ConfirmDialog
          title={
            confirm === "submit"
              ? "解答を提出しますか？"
              : "模擬試験を終了しますか？"
          }
          confirmLabel={confirm === "submit" ? "提出して採点する" : "終了する"}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm === "submit") {
              setFinished(true);
              setConfirm(null);
              window.scrollTo(0, 0);
            } else reset();
          }}
        >
          <p>
            {confirm === "submit"
              ? `60問中${answered}問に解答しています。${answered < 60 ? `未解答の${60 - answered}問は不正解として採点します。` : "提出後は解答を変更できません。"}`
              : "途中の解答は保存されません。"}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
