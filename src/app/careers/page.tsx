import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  alternates: { canonical: "/careers" },
  description: "Open roles at CNTXT AI: AI evaluators, coding experts, bilingual annotators and robotics data collectors. Remote and on-site options.",
};

export default function Careers() {
  return (
    <div>
      <CareersPage />
    </div>
  );
}
