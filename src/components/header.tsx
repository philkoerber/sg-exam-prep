"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, House, Timer } from "lucide-react";
import { useLanguage } from "./language";
export function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const { language, text, setLanguage, sessionActive } = useLanguage();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="brand"
          href="/"
          aria-label={`SG ${text.brand} · ${text.home}`}
        >
          <span className="brand-mark">
            sg<span>.</span>
          </span>
          <span className="brand-name">
            {text.brand}
            <small>{text.brandSubtitle}</small>
          </span>
        </Link>
        <nav aria-label={text.navigation}>
          {[
            { href: "/", label: text.home, Icon: House },
            { href: "/practice", label: text.practice, Icon: BookOpen },
            { href: "/exam", label: text.exam, Icon: Timer },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "nav-link active" : "nav-link"}
              aria-current={path === href ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={1.7} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="official-link"
            href="https://www.ipa.go.jp/shiken/kubun/sg.html"
            target="_blank"
            rel="noreferrer"
          >
            {text.aboutExam}
            <ArrowUpRight size={15} />
          </a>
          {!sessionActive && (
            <div
              className="language-switch"
              role="group"
              aria-label="日本語 / English"
            >
              <button
                type="button"
                lang="ja"
                aria-pressed={language === "ja"}
                onClick={() => setLanguage("ja")}
              >
                日本語
              </button>
              <button
                type="button"
                lang="en"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                English
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
