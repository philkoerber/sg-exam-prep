import { ShieldCheck, Bug, KeyRound, Network, Scale, Cpu } from "lucide-react";
import type { topics } from "@/lib/corpus/topics";
const icons = {
  shield: ShieldCheck,
  bug: Bug,
  key: KeyRound,
  network: Network,
  scale: Scale,
  cpu: Cpu,
};
export function TopicIcon({
  name,
  size = 22,
}: {
  name: (typeof topics)[number]["icon"];
  size?: number;
}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
