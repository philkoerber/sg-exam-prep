"use client";
import { Check, X, ExternalLink, ZoomIn } from "lucide-react";
import type { Question } from "@/lib/corpus/schema";
import { topicCopy } from "@/lib/corpus/topics";
import { useLanguage } from "./language";

export function QuestionView({
  question: q,
  selected,
  onSelect,
  revealed = false,
  disabled = false,
}: {
  question: Question;
  selected?: string;
  onSelect?: (key: string) => void;
  revealed?: boolean;
  disabled?: boolean;
}) {
  const { language, text } = useLanguage();
  const copy = text.question;
  return (
    <article className="question-card">
      <div className="question-tags">
        <span className="tag green">{topicCopy(q.topic, language).name}</span>
        <span className="tag">{text.subject(q.subject)}</span>
        <span className="tag subtle">
          {copy.year(q.year)}{" "}
          {q.era === "sample"
            ? copy.sample
            : q.era === "legacy"
              ? copy.legacy
              : copy.public}
        </span>
      </div>
      {q.display === "text" ? (
        <h2 className="question-prompt" lang="ja">
          {q.prompt}
        </h2>
      ) : (
        <div className="original-question">
          <div className="question-blocks">
            {q.blocks.map((block, i) =>
              block.type === "paragraph" ? (
                <p key={i} lang="ja">
                  {block.text}
                </p>
              ) : (
                <figure className="question-figure" key={i}>
                  <a
                    href={block.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={copy.zoomFigure}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      width={block.width}
                      height={block.height}
                      alt={copy.figureAlt(q.source.label)}
                    />
                  </a>
                  <figcaption>
                    <ZoomIn size={12} />
                    {copy.zoomHint}
                  </figcaption>
                </figure>
              ),
            )}
          </div>
          <details className="source-images">
            <summary>{copy.originalLayout}</summary>
            {q.images.map((img, i) => (
              <a
                href={img.src}
                target="_blank"
                rel="noreferrer"
                className="original-image-link"
                key={img.src}
                aria-label={copy.zoomPage(i + 1)}
              >
                {/* Original exam crops deliberately preserve tables, diagrams, and formulas. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={copy.pageAlt(q.source.label, i + 1)}
                />
              </a>
            ))}
          </details>
        </div>
      )}
      <fieldset
        className={
          q.display === "original" ? "choices compact-choices" : "choices"
        }
        disabled={disabled || revealed}
      >
        <legend>{revealed ? copy.answers : copy.chooseOne}</legend>
        {q.choices.map((choice) => {
          const correct = revealed && choice.key === q.answer;
          const incorrect = revealed && selected === choice.key && !correct;
          return (
            <label
              className={`choice ${selected === choice.key ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`}
              key={choice.key}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={choice.key}
                checked={selected === choice.key}
                onChange={() => onSelect?.(choice.key)}
              />
              <span className="choice-key" lang="ja">
                {choice.key}
              </span>
              <span
                className="choice-text"
                lang={q.display === "text" ? "ja" : undefined}
              >
                {q.display === "text" ? choice.text : copy.select(choice.key)}
              </span>
              {correct ? (
                <Check
                  className="choice-status"
                  size={20}
                  aria-label={copy.correct}
                />
              ) : incorrect ? (
                <X
                  className="choice-status"
                  size={20}
                  aria-label={copy.incorrect}
                />
              ) : (
                <span className="choice-radio" />
              )}
            </label>
          );
        })}
      </fieldset>
      {revealed && (
        <div
          className={`feedback ${selected === q.answer ? "success" : "error"}`}
          role="status"
        >
          {selected === q.answer ? <Check size={21} /> : <X size={21} />}
          <div>
            <strong>
              {selected === q.answer
                ? copy.correctFeedback
                : selected
                  ? copy.incorrectFeedback
                  : copy.unansweredFeedback}
            </strong>
            <p>
              {copy.correctAnswer(q.answer)}
              {q.display === "text" && (
                <span lang="ja">
                  {" "}
                  {q.choices.find((c) => c.key === q.answer)?.text}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="question-source">
        <span>
          {copy.source}
          <span lang="ja">{q.source.label}</span>
        </span>
        <a
          href={`${q.source.url}#page=${q.source.pages[0]}`}
          target="_blank"
          rel="noreferrer"
        >
          {copy.original}
          <ExternalLink size={12} />
        </a>
        {revealed && (
          <a href={q.source.answerUrl} target="_blank" rel="noreferrer">
            {copy.officialAnswer}
            <ExternalLink size={12} />
          </a>
        )}
        <small>{copy.copyright}</small>
      </div>
    </article>
  );
}
