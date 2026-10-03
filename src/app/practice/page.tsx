import { Suspense } from "react";
import type { Metadata } from "next";
import { Practice } from "@/components/practice";
import { Loading } from "@/components/site-shell";
export const metadata: Metadata = { title: "分野別練習" };
export default function PracticePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Practice />
    </Suspense>
  );
}
