import type { Metadata } from "next";
import { HealthcarePage } from "@/components/healthcare/HealthcarePage";

export const metadata: Metadata = {
  title: "Healthcare",
  alternates: { canonical: "/healthcare" },
  description: "HIPAA-compliant data, medical AI evaluation and Arabic voice AI for healthcare, hosted in region or deployed on-premises.",
};

export default function Healthcare() {
  return (
    <div>
      <HealthcarePage />
    </div>
  );
}
