import { z } from "zod";

export const topicIds = [
  "management",
  "threats",
  "technology",
  "operations",
  "law",
  "it",
] as const;

const cellSchema = z.object({
  text: z.string(),
  colSpan: z.number().int().positive(),
  rowSpan: z.number().int().positive(),
  blank: z.boolean().optional(),
});
const tableSchema = z
  .object({
    type: z.literal("table"),
    columns: z.array(z.number().positive()).min(2),
    headerRows: z.number().int().nonnegative(),
    caption: z.string().optional(),
    rows: z.array(z.array(cellSchema)).min(2),
  })
  .superRefine((table, ctx) => {
    const occupied = new Set<string>();
    if (table.headerRows >= table.rows.length) {
      ctx.addIssue({ code: "custom", message: "A table needs body rows" });
    }
    table.rows.forEach((row, r) => {
      let c = 0;
      for (const cell of row) {
        while (occupied.has(`${r}:${c}`)) c++;
        for (let y = r; y < r + cell.rowSpan; y++) {
          for (let x = c; x < c + cell.colSpan; x++) {
            const key = `${y}:${x}`;
            if (
              occupied.has(key) ||
              y >= table.rows.length ||
              x >= table.columns.length
            ) {
              ctx.addIssue({
                code: "custom",
                message: "Overlapping or out-of-bounds table cell",
              });
            }
            occupied.add(key);
          }
        }
        c += cell.colSpan;
      }
    });
    if (occupied.size !== table.rows.length * table.columns.length) {
      ctx.addIssue({ code: "custom", message: "Incomplete table grid" });
    }
  });

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({
    type: z.literal("panel"),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  tableSchema,
  z.object({
    type: z.literal("diagram"),
    label: z.string().min(1),
    viewBox: z.tuple([
      z.number(),
      z.number(),
      z.number().positive(),
      z.number().positive(),
    ]),
    paths: z
      .array(
        z.object({
          d: z.string().regex(/^[MLCZ0-9.,\s-]+$/),
          fill: z.string().regex(/^(none|#[0-9a-f]{6})$/),
          stroke: z.string().regex(/^(none|#[0-9a-f]{6})$/),
          strokeWidth: z.number().nonnegative(),
          dash: z.array(z.number().nonnegative()),
        }),
      )
      .min(1),
    texts: z
      .array(
        z.object({
          text: z.string().min(1),
          x: z.number(),
          y: z.number(),
          width: z.number().positive(),
          size: z.number().positive(),
        }),
      )
      .min(1),
  }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const questionSchema = z
  .object({
    id: z.string().min(1),
    familyId: z.string().min(1),
    subject: z.enum(["A", "B"]),
    topic: z.enum(topicIds),
    pool: z.enum(["study", "benchmark"]),
    choices: z
      .array(
        z.object({
          key: z.string().min(1),
          text: z.string().optional(),
          cells: z.array(z.string()).optional(),
        }),
      )
      .min(2),
    choiceTable: z.object({ headers: z.array(z.string()).min(1) }).optional(),
    answer: z.string().min(1),
    display: z.enum(["text", "structured"]),
    blocks: z.array(contentBlockSchema).min(1),
    source: z.discriminatedUnion("kind", [
      z
        .object({
          kind: z.literal("official"),
          year: z.number().int(),
          number: z.number().int().positive(),
          era: z.enum(["legacy", "sample", "cbt"]),
          label: z.string().min(1),
          url: z.url(),
          answerUrl: z.url(),
          file: z.string().endsWith(".pdf"),
          pages: z.array(z.number().int().positive()).min(1),
        })
        .strict(),
      z
        .object({
          kind: z.literal("generated"),
          referenceQuestionIds: z.array(z.string().min(1)).min(1),
          references: z
            .array(
              z.object({
                resourceId: z.string().min(1),
                section: z.string().min(1),
              }),
            )
            .min(1),
        })
        .strict(),
    ]),
  })
  .superRefine((q, ctx) => {
    if (!q.choices.some((c) => c.key === q.answer))
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: answer missing from choices`,
      });
    if (new Set(q.choices.map((c) => c.key)).size !== q.choices.length)
      ctx.addIssue({ code: "custom", message: `${q.id}: duplicate choices` });
    if (q.subject === "A" && q.choices.length !== 4)
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: subject A requires four choices`,
      });
    if (q.display === "text" && q.blocks.some((b) => b.type !== "paragraph"))
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: text display requires paragraphs`,
      });
    if (
      q.choiceTable &&
      (q.display !== "structured" ||
        q.choices.some(
          (c) => c.cells?.length !== q.choiceTable!.headers.length,
        ))
    )
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: invalid choice table`,
      });
    if (
      q.choices.some((c) => (c.text === undefined) === (c.cells === undefined))
    )
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: each choice needs text or cells, never both`,
      });
    if (!q.choiceTable && q.choices.some((c) => c.cells))
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: cells require a choice table`,
      });
  });
export type Question = z.infer<typeof questionSchema>;
export type TopicId = (typeof topicIds)[number];
