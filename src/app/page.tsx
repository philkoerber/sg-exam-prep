import Link from "next/link";
import { ArrowRight, BookOpen, Timer, Check, ArrowUpRight } from "lucide-react";
import { topics } from "@/lib/corpus/topics";
import { TopicIcon } from "@/components/icons";
import { corpus } from "@/lib/corpus";

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" /> 情報セキュリティマネジメント試験
          </div>
          <h1>
            ひとつずつ、
            <br />
            確かな<span className="ink-accent">知識</span>に。
          </h1>
          <p className="hero-description">
            気になる分野を、じっくり。
            <br />
            本番の120分を、しっかり。
            <br className="mobile-break" />
            あなたのペースで始めましょう。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/practice">
              分野を選んで練習する
              <ArrowRight size={18} />
            </Link>
            <span className="quiet-note">登録不要・履歴の保存なし</span>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="study-note">
            <div className="note-top">
              <span>今日の、一問。</span>
              <span>01 / SG</span>
            </div>
            <div className="note-question">
              知識を深める。
              <br />
              自信につなげる。
            </div>
            <div className="note-option">
              <span>ア</span>
              <i />
            </div>
            <div className="note-option checked">
              <span>イ</span>
              <i />
              <Check size={18} />
            </div>
            <div className="note-option">
              <span>ウ</span>
              <i />
            </div>
            <div className="note-footer">小さな理解が、大きな力に。</div>
          </div>
          <span className="floating-stamp">学</span>
          <div className="illustration-caption">焦らず、自分のペースで。</div>
        </div>
      </section>
      <section className="mode-section" aria-labelledby="mode-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ふたつの学び方</div>
            <h2 id="mode-title">今日は、どう学びますか。</h2>
          </div>
          <span className="section-caption">
            公式問題 {corpus.length} 問を収録
          </span>
        </div>
        <div className="mode-grid">
          <Link href="/practice" className="mode-card">
            <div className="mode-icon">
              <BookOpen size={24} strokeWidth={1.6} />
            </div>
            <div className="mode-text">
              <div className="mode-kicker">自分のペースで</div>
              <h3>分野別練習</h3>
              <p>
                学びたい分野を選んで、10問ずつ。
                <br />
                一問ごとに正解を確認できます。
              </p>
              <span className="mode-meta">
                時間制限なし<span>·</span>すぐに答え合わせ
              </span>
            </div>
            <ArrowUpRight className="card-arrow" size={23} strokeWidth={1.5} />
          </Link>
          <Link href="/exam" className="mode-card exam-card">
            <div className="mode-icon">
              <Timer size={24} strokeWidth={1.6} />
            </div>
            <div className="mode-text">
              <div className="mode-kicker">本番をイメージして</div>
              <h3>模擬試験</h3>
              <p>
                60問に、120分で挑戦。
                <br />
                すべて解き終えてから振り返ります。
              </p>
              <span className="mode-meta">
                科目A 48問<span>·</span>科目B 12問
              </span>
            </div>
            <ArrowUpRight className="card-arrow" size={23} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
      <section className="topics-preview" aria-labelledby="topics-title">
        <div className="section-heading">
          <h2 id="topics-title">気になる分野から。</h2>
          <Link className="text-link" href="/practice">
            すべての分野を見る
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="topic-shortcuts">
          {topics.map((t) => (
            <Link href={`/practice?topic=${t.id}`} key={t.id}>
              <TopicIcon name={t.icon} size={19} />
              <span>{t.name}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <div className="source-note">
        <span className="source-dot" />
        <p>
          IPAが公開する問題・解答を使用しています。
          <br className="mobile-break" />
          学習結果は画面を閉じると消えます。
        </p>
      </div>
    </div>
  );
}
