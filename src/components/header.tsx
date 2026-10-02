"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, House, Timer } from "lucide-react";
export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="SG学習室 ホーム">
          <span className="brand-mark">
            sg<span>.</span>
          </span>
          <span className="brand-name">
            学習室<small>情報セキュリティマネジメント</small>
          </span>
        </Link>
        <nav aria-label="メインナビゲーション">
          {[
            { href: "/", label: "ホーム", Icon: House },
            { href: "/practice", label: "分野別練習", Icon: BookOpen },
            { href: "/exam", label: "模擬試験", Icon: Timer },
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
        <a
          className="official-link"
          href="https://www.ipa.go.jp/shiken/kubun/sg.html"
          target="_blank"
          rel="noreferrer"
        >
          試験について
          <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  );
}
