"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language";
export default function NotFound() {
  const { text } = useLanguage();
  return (
    <div className="page empty-page">
      <span className="eyebrow">404</span>
      <h1>{text.notFound}</h1>
      <Link className="button primary" href="/">
        {text.homeLink}
      </Link>
    </div>
  );
}
