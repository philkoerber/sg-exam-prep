import type { ContentBlock } from "@/lib/corpus/schema";

// Render a small, typed content vocabulary. No raw HTML or Markdown execution.
export function QuestionContent({
  block,
  label,
}: {
  block: ContentBlock;
  label: string;
}) {
  switch (block.type) {
    case "paragraph":
      return <p lang="ja">{block.text}</p>;
    case "panel":
      return (
        <div className="question-panel" lang="ja">
          {block.paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      );
    case "table": {
      const longText = block.rows.some((row) =>
        row.some((cell) => cell.text.length > 60),
      );
      const baseWidth = Math.max(
        longText ? 560 : 300,
        block.columns.length * 90,
      );
      // PDF grids can have very narrow numeric columns. Reserve enough room
      // for a readable digit/answer blank and padding, even on a phone.
      const widths = block.columns.map((width) =>
        Math.max(74, (width * baseWidth) / 100),
      );
      const minWidth = Math.ceil(
        widths.reduce((total, width) => total + width, 0),
      );
      return (
        <div
          className="question-scroll"
          role="region"
          aria-label={label}
          tabIndex={0}
        >
          <table className="question-table" lang="ja" style={{ minWidth }}>
            <caption className={block.caption ? undefined : "sr-only"}>
              {block.caption || label}
            </caption>
            <colgroup>
              {widths.map((width, i) => (
                <col
                  key={i}
                  style={{ width: `${(width / minWidth) * 100}%` }}
                />
              ))}
            </colgroup>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => {
                    const Tag = r < block.headerRows ? "th" : "td";
                    const blank = cell.blank || /^[a-z]\s?\d?$/.test(cell.text);
                    return (
                      <Tag
                        key={c}
                        colSpan={cell.colSpan}
                        rowSpan={cell.rowSpan}
                        scope={
                          Tag === "th"
                            ? cell.colSpan > 1
                              ? "colgroup"
                              : "col"
                            : undefined
                        }
                      >
                        {blank ? (
                          <span
                            className="answer-blank"
                            aria-label={cell.blank ? "空欄" : undefined}
                          >
                            {cell.text || "\u00a0"}
                          </span>
                        ) : (
                          cell.text
                        )}
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "diagram":
      return (
        <div
          className="question-scroll"
          role="region"
          aria-label={block.label}
          tabIndex={0}
        >
          <svg
            className="question-diagram"
            viewBox={block.viewBox.join(" ")}
            role="img"
            aria-label={block.label}
            lang="ja"
          >
            <title>{block.label}</title>
            {block.paths.map((path, i) => (
              <path
                key={i}
                d={path.d}
                fill={path.fill}
                stroke={path.stroke}
                strokeWidth={path.strokeWidth}
                strokeDasharray={path.dash.join(" ")}
              />
            ))}
            {block.texts.map((text, i) => (
              <text
                key={i}
                x={text.x}
                y={text.y}
                fontSize={text.size}
                textLength={text.width}
                lengthAdjust="spacingAndGlyphs"
              >
                {text.text}
              </text>
            ))}
          </svg>
        </div>
      );
  }
}
