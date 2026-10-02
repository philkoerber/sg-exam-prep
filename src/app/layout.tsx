import type { Metadata } from "next";
import { Header } from "@/components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "SG学習室｜情報セキュリティマネジメント試験",
    template: "%s｜SG学習室",
  },
  description:
    "日本語の公式問題で、分野別の練習と120分の模擬試験。登録不要、学習履歴の保存なし。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main">
          本文へ移動
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <span>
            <b>sg.</b> 学ぶことを、少しずつ。
          </span>
          <span>
            問題の著作権はIPAに帰属します。IPA非公式の学習ツールです。
          </span>
        </footer>
      </body>
    </html>
  );
}
