"use client";
import { Check, X, ExternalLink } from "lucide-react";
import type { Question } from "@/lib/corpus/schema";
import { topicCopy } from "@/lib/corpus/topics";
import { useLanguage } from "./language";
import {
  choiceText,
  questionBlocks,
  questionLabel,
  questionPrompt,
} from "@/lib/corpus/content";
import { QuestionContent } from "./question-content";

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
    <article className="question-card" data-question-id={q.id}>
      <div className="question-tags">
        <span className="tag green">{topicCopy(q.topic, language).name}</span>
        <span className="tag">{text.subject(q.subject)}</span>
        {q.source.kind === "official" && (
          <span className="tag subtle">
            {copy.year(q.source.year)}{" "}
            {q.source.era === "sample"
              ? copy.sample
              : q.source.era === "legacy"
                ? copy.legacy
                : copy.public}
          </span>
        )}
      </div>
      {q.display === "text" ? (
        <h2 className="question-prompt" lang="ja">
          {questionPrompt(q)}
        </h2>
      ) : (
        <div className="question-blocks">
          {questionBlocks(q).map((block, i) => (
            <QuestionContent
              key={i}
              block={block}
              label={`${questionLabel(q)} · ${i + 1}`}
            />
          ))}
        </div>
      )}
      <fieldset
        className={
          q.display === "structured" ? "choices compact-choices" : "choices"
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
                {q.display === "text"
                  ? choiceText(choice)
                  : copy.select(choice.key)}
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
                  {choiceText(q.choices.find((c) => c.key === q.answer)!)}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      {q.source.kind === "official" && (
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
      )}
    </article>
  );
}
