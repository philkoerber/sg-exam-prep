"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Timer, Check, ArrowUpRight } from "lucide-react";
import { topics, topicCopy } from "@/lib/corpus/topics";
import { TopicIcon } from "@/components/icons";
import { useLanguage } from "./language";

export function Home({ questionCount }: { questionCount: number }) {
  const { language, text } = useLanguage();
  const home = text.homePage;
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" /> {text.examName}
          </div>
          <h1>
            {home.titleStart}
            <br />
            {home.titleBefore}
            <span className="ink-accent">{home.titleAccent}</span>
            {home.titleAfter}
          </h1>
          <p className="hero-description">
            {home.intro}
            <br />
            {home.description}
            {language === "en" && " "}
            <br className="mobile-break" />
            {home.invitation}
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/practice">
              {home.start}
              <ArrowRight size={18} />
            </Link>
            <span className="quiet-note">{home.noAccount}</span>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden="true" lang="ja">
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
            <div className="eyebrow">{home.modes}</div>
            <h2 id="mode-title">{home.chooseMode}</h2>
          </div>
          <span className="section-caption">
            {home.questionCount(questionCount)}
          </span>
        </div>
        <div className="mode-grid">
          <Link href="/practice" className="mode-card">
            <div className="mode-icon">
              <BookOpen size={24} strokeWidth={1.6} />
            </div>
            <div className="mode-text">
              <div className="mode-kicker">{home.practiceKicker}</div>
              <h3>{text.practice}</h3>
              <p>
                {home.practiceDescription}
                <br />
                {home.practiceFeedback}
              </p>
              <span className="mode-meta">
                {home.untimed}
                <span>·</span>
                {home.immediateFeedback}
              </span>
            </div>
            <ArrowUpRight className="card-arrow" size={23} strokeWidth={1.5} />
          </Link>
          <Link href="/exam" className="mode-card exam-card">
            <div className="mode-icon">
              <Timer size={24} strokeWidth={1.6} />
            </div>
            <div className="mode-text">
              <div className="mode-kicker">{home.examKicker}</div>
              <h3>{text.exam}</h3>
              <p>
                {home.examDescription}
                <br />
                {home.examReview}
              </p>
              <span className="mode-meta">
                {home.subjectA}
                <span>·</span>
                {home.subjectB}
              </span>
            </div>
            <ArrowUpRight className="card-arrow" size={23} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
      <section className="topics-preview" aria-labelledby="topics-title">
        <div className="section-heading">
          <h2 id="topics-title">{home.chooseTopic}</h2>
          <Link className="text-link" href="/practice">
            {home.viewTopics}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="topic-shortcuts">
          {topics.map((t) => (
            <Link href={`/practice?topic=${t.id}`} key={t.id}>
              <TopicIcon name={t.icon} size={19} />
              <span>{topicCopy(t.id, language).name}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <div className="source-note">
        <span className="source-dot" />
        <p>
          {home.source}
          {language === "en" && " "}
          <br className="mobile-break" />
          {home.ephemeral}
        </p>
      </div>
    </div>
  );
}
