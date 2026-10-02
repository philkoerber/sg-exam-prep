import type { Metadata } from "next";
import { Exam } from "@/components/exam";
export const metadata: Metadata = { title: "模擬試験" };
export default function ExamPage() {
  return <Exam />;
}
