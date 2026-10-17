import type { Metadata } from "next";
import { EvaluatePage } from "@/components/evaluate/EvaluatePage";

export const metadata: Metadata = {
  title: "Evaluate AI",
  alternates: { canonical: "/evaluate-ai" },
  description: "TestAI tests, evaluates and audits AI systems for bias, reliability and compliance before deployment, with human review by domain experts and native Arabic speakers.",
};

export default function EvaluateAi() {
  return (
    <div>
      <EvaluatePage />
    </div>
  );
}
