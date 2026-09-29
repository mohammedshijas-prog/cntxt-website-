import type { Metadata } from "next";
import { HealthcarePage } from "@/components/healthcare/HealthcarePage";

export const metadata: Metadata = {
  title: "Healthcare | CNTXT AI",
  description: "Real-world AI for healthcare.",
};

export default function Healthcare() {
  return (
    <div>
      <HealthcarePage />
    </div>
  );
}
