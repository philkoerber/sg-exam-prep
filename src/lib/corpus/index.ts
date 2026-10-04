import sample from "../../../data/questions/official/sg-2022-sample.json";
import y2023 from "../../../data/questions/official/sg-2023-public.json";
import y2024 from "../../../data/questions/official/sg-2024-public.json";
import y2025 from "../../../data/questions/official/sg-2025-public.json";
import y2026 from "../../../data/questions/official/sg-2026-public.json";
import pilot from "../../../data/questions/generated/pilot-001.json";
import type { Question } from "./schema";
// Validation and review happen before release; there is no runtime service.
export const officialCorpus = [
  ...sample,
  ...y2023,
  ...y2024,
  ...y2025,
  ...y2026,
] as Question[];
export const generatedCorpus = pilot as Question[];
export const corpus = [...officialCorpus, ...generatedCorpus];
