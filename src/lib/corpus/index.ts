import sample from "../../../data/questions/sg-2022-sample.json";
import y2023 from "../../../data/questions/sg-2023-public.json";
import y2024 from "../../../data/questions/sg-2024-public.json";
import y2025 from "../../../data/questions/sg-2025-public.json";
import y2026 from "../../../data/questions/sg-2026-public.json";
import type { Question } from "./schema";
// Files are validated by corpus:validate and tests before release. No runtime fetch or service.
export const corpus = [
  ...sample,
  ...y2023,
  ...y2024,
  ...y2025,
  ...y2026,
] as Question[];
