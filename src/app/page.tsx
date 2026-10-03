import { Home } from "@/components/home";
import { corpus } from "@/lib/corpus";

export default function HomePage() {
  return <Home questionCount={corpus.length} />;
}
