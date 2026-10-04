import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "SG学習室｜情報セキュリティマネジメント試験",
    template: "%s｜SG学習室",
  },
  description:
    "日本語の問題で、分野別の練習と120分の模擬試験。登録不要、学習履歴の保存なし。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
