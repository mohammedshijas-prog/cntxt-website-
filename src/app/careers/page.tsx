import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers | CNTXT AI",
  description: "Build AI that matters, with people who’ve seen the real world.",
};

export default function Careers() {
  return (
    <div>
      <CareersPage />
    </div>
  );
}
