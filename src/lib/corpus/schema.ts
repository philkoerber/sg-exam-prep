import { z } from "zod";

export const topicIds = [
  "management",
  "threats",
  "technology",
  "operations",
  "law",
  "it",
] as const;
export const questionSchema = z
  .object({
    id: z.string().min(1),
    year: z.number().int(),
    number: z.number().int().positive(),
    era: z.enum(["legacy", "sample", "cbt"]),
    subject: z.enum(["A", "B"]),
    topic: z.enum(topicIds),
    pool: z.enum(["study", "benchmark"]),
    prompt: z.string().min(1),
    choices: z
      .array(z.object({ key: z.string().min(1), text: z.string() }))
      .min(2),
    answer: z.string().min(1),
    display: z.enum(["text", "original"]),
    images: z.array(
      z.object({
        src: z.string().startsWith("/question-assets/"),
        width: z.number().positive(),
        height: z.number().positive(),
      }),
    ),
    blocks: z.array(
      z.discriminatedUnion("type", [
        z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
        z.object({
          type: z.literal("figure"),
          src: z.string().startsWith("/question-assets/"),
          width: z.number().positive(),
          height: z.number().positive(),
        }),
      ]),
    ),
    source: z.object({
      label: z.string().min(1),
      url: z.url(),
      answerUrl: z.url(),
      file: z.string().endsWith(".pdf"),
      pages: z.array(z.number().int().positive()).min(1),
    }),
  })
  .superRefine((q, ctx) => {
    if (!q.choices.some((c) => c.key === q.answer))
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: answer missing from choices`,
      });
    if (new Set(q.choices.map((c) => c.key)).size !== q.choices.length)
      ctx.addIssue({ code: "custom", message: `${q.id}: duplicate choices` });
    if (q.display === "original" && !q.images.length)
      ctx.addIssue({
        code: "custom",
        message: `${q.id}: original page images required`,
      });
  });
export type Question = z.infer<typeof questionSchema>;
export type TopicId = (typeof topicIds)[number];
