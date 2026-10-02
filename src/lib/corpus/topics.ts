import type { TopicId } from "./schema";
export const topics: {
  id: TopicId;
  name: string;
  description: string;
  icon: "shield" | "bug" | "key" | "network" | "scale" | "cpu";
}[] = [
  {
    id: "management",
    name: "セキュリティ管理",
    description: "リスク管理・ISMS・情報資産",
    icon: "shield",
  },
  {
    id: "threats",
    name: "脅威と攻撃",
    description: "マルウェア・不正アクセス・攻撃手法",
    icon: "bug",
  },
  {
    id: "technology",
    name: "認証・暗号・技術",
    description: "認証・暗号化・ネットワーク防御",
    icon: "key",
  },
  {
    id: "operations",
    name: "運用と対策",
    description: "インシデント対応・監査・事業継続",
    icon: "network",
  },
  {
    id: "law",
    name: "法務・コンプライアンス",
    description: "個人情報・知的財産・関連法規",
    icon: "scale",
  },
  {
    id: "it",
    name: "IT・マネジメント",
    description: "システム・経営・プロジェクト管理",
    icon: "cpu",
  },
];
export function topicName(id: TopicId) {
  return topics.find((t) => t.id === id)!.name;
}
