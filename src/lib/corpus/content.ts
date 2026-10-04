import type { ContentBlock, Question } from "./schema";

export function choiceText(choice: Question["choices"][number]): string {
  return choice.cells?.join(" / ") ?? choice.text ?? "";
}

export function questionPrompt(q: Question): string {
  return q.blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => b.text)
    .join("\n");
}

export function questionLabel(q: Question): string {
  return q.source.kind === "official" ? q.source.label : q.id;
}

// Generated choices are authored once. Materialize their printed layout from
// that same data, so a table cannot disagree with the answer controls.
export function questionBlocks(q: Question): ContentBlock[] {
  if (q.source.kind === "official" || q.display === "text") return q.blocks;
  if (!q.choiceTable)
    return [
      ...q.blocks,
      ...q.choices.map((c): ContentBlock => ({
        type: "paragraph",
        text: `${c.key}　${choiceText(c)}`,
      })),
    ];
  const headers = ["", ...q.choiceTable.headers];
  const cell = (text: string) => ({ text, colSpan: 1, rowSpan: 1 });
  return [
    ...q.blocks,
    {
      type: "table",
      columns: headers.map(() => 100 / headers.length),
      headerRows: 1,
      rows: [
        headers.map(cell),
        ...q.choices.map((c) => [c.key, ...c.cells!].map(cell)),
      ],
    },
  ];
}
