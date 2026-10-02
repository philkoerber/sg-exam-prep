import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page empty-page">
      <span className="eyebrow">404</span>
      <h1>ページが見つかりません。</h1>
      <Link className="button primary" href="/">
        ホームに戻る
      </Link>
    </div>
  );
}
