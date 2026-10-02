import { Check, X, ExternalLink, ZoomIn } from "lucide-react";
import type { Question } from "@/lib/corpus/schema";
import { topicName } from "@/lib/corpus/topics";

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
  return (
    <article className="question-card">
      <div className="question-tags">
        <span className="tag green">{topicName(q.topic)}</span>
        <span className="tag">科目{q.subject}</span>
        <span className="tag subtle">
          {q.year}年{" "}
          {q.era === "sample"
            ? "公式サンプル"
            : q.era === "legacy"
              ? "旧形式"
              : "公開問題"}
        </span>
      </div>
      {q.display === "text" ? (
        <h2 className="question-prompt">{q.prompt}</h2>
      ) : (
        <div className="original-question">
          <div className="question-blocks">
            {q.blocks.map((block, i) =>
              block.type === "paragraph" ? (
                <p key={i}>{block.text}</p>
              ) : (
                <figure className="question-figure" key={i}>
                  <a
                    href={block.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`図表を拡大（新しいタブ）`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      width={block.width}
                      height={block.height}
                      alt={`${q.source.label}の図表`}
                    />
                  </a>
                  <figcaption>
                    <ZoomIn size={12} />
                    図表を押すと拡大できます
                  </figcaption>
                </figure>
              ),
            )}
          </div>
          <details className="source-images">
            <summary>原文のレイアウトを確認する</summary>
            {q.images.map((img, i) => (
              <a
                href={img.src}
                target="_blank"
                rel="noreferrer"
                className="original-image-link"
                key={img.src}
                aria-label={`問題の${i + 1}ページ目を拡大（新しいタブ）`}
              >
                {/* Original exam crops deliberately preserve tables, diagrams, and formulas. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={`${q.source.label} ${i + 1}ページ目`}
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
        <legend>
          {revealed ? "解答と正解" : "正しいものを一つ選んでください。"}
        </legend>
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
              <span className="choice-key">{choice.key}</span>
              <span className="choice-text">
                {q.display === "text" ? choice.text : `${choice.key}を選択`}
              </span>
              {correct ? (
                <Check className="choice-status" size={20} aria-label="正解" />
              ) : incorrect ? (
                <X className="choice-status" size={20} aria-label="不正解" />
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
                ? "正解です。"
                : selected
                  ? "もう一度、確認しましょう。"
                  : "この問題は未解答です。"}
            </strong>
            <p>
              正解は「{q.answer}」です。
              {q.display === "text" &&
                ` ${q.choices.find((c) => c.key === q.answer)?.text}`}
            </p>
          </div>
        </div>
      )}
      <div className="question-source">
        <span>出典：{q.source.label}</span>
        <a
          href={`${q.source.url}#page=${q.source.pages[0]}`}
          target="_blank"
          rel="noreferrer"
        >
          原本
          <ExternalLink size={12} />
        </a>
        {revealed && (
          <a href={q.source.answerUrl} target="_blank" rel="noreferrer">
            公式解答
            <ExternalLink size={12} />
          </a>
        )}
        <small>© IPA · 表示用に改行・レイアウトを調整</small>
      </div>
    </article>
  );
}
