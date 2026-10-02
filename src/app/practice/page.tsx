import { Suspense } from "react";
import type { Metadata } from "next";
import { Practice } from "@/components/practice";
export const metadata: Metadata = { title: "分野別練習" };
export default function PracticePage() {
  return (
    <Suspense fallback={<div className="page">読み込み中…</div>}>
      <Practice />
    </Suspense>
  );
}
