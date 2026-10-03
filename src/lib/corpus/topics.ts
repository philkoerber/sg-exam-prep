import type { TopicId } from "./schema";
import type { Language } from "../messages";
export const topics: {
  id: TopicId;
  name: string;
  description: string;
  en: { name: string; description: string };
  icon: "shield" | "bug" | "key" | "network" | "scale" | "cpu";
}[] = [
  {
    id: "management",
    name: "セキュリティ管理",
    description: "リスク管理・ISMS・情報資産",
    en: {
      name: "Security management",
      description: "Risk management · ISMS · Information assets",
    },
    icon: "shield",
  },
  {
    id: "threats",
    name: "脅威と攻撃",
    description: "マルウェア・不正アクセス・攻撃手法",
    en: {
      name: "Threats and attacks",
      description: "Malware · Unauthorised access · Attack methods",
    },
    icon: "bug",
  },
  {
    id: "technology",
    name: "認証・暗号・技術",
    description: "認証・暗号化・ネットワーク防御",
    en: {
      name: "Authentication and cryptography",
      description: "Authentication · Encryption · Network defence",
    },
    icon: "key",
  },
  {
    id: "operations",
    name: "運用と対策",
    description: "インシデント対応・監査・事業継続",
    en: {
      name: "Operations and safeguards",
      description: "Incident response · Audits · Business continuity",
    },
    icon: "network",
  },
  {
    id: "law",
    name: "法務・コンプライアンス",
    description: "個人情報・知的財産・関連法規",
    en: {
      name: "Law and compliance",
      description: "Personal data · Intellectual property · Legislation",
    },
    icon: "scale",
  },
  {
    id: "it",
    name: "IT・マネジメント",
    description: "システム・経営・プロジェクト管理",
    en: {
      name: "IT and management",
      description: "Systems · Business · Project management",
    },
    icon: "cpu",
  },
];
export function topicCopy(id: TopicId, language: Language = "ja") {
  const topic = topics.find((t) => t.id === id)!;
  return language === "en" ? topic.en : topic;
}
