"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { useLanguage } from "./language";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { language, text } = useLanguage();
  const path = usePathname();
  useEffect(() => {
    document.documentElement.lang = language;
    const page = path.startsWith("/practice")
      ? text.practice
      : path.startsWith("/exam")
        ? text.exam
        : text.examName;
    document.title = `${page}｜SG ${text.brand}`;
  }, [language, text, path]);

  return (
    <>
      <a className="skip-link" href="#main">
        {text.skipLink}
      </a>
      <Header />
      <main id="main">{children}</main>
      <footer className="site-footer">
        <span>
          <b>sg.</b> {text.footer}
        </span>
        <span>{text.copyright}</span>
      </footer>
    </>
  );
}

export function Loading() {
  const { text } = useLanguage();
  return <div className="page">{text.loading}</div>;
}
