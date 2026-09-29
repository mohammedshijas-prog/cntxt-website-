import type { Metadata } from "next";
import { EvaluatePage } from "@/components/evaluate/EvaluatePage";

export const metadata: Metadata = {
  title: "Evaluate AI | CNTXT AI",
  description: "Know how your AI performs in the real world before your users do.",
};

export default function EvaluateAi() {
  return (
    <div>
      <EvaluatePage />
    </div>
  );
}
