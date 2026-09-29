import type { Metadata } from "next";
import { SolutionsPage } from "@/components/solutions/SolutionsPage";

export const metadata: Metadata = {
  title: "Solutions | CNTXT AI",
  description: "Real-world AI for enterprises.",
};

export default function Solutions() {
  return (
    <div>
      <SolutionsPage />
    </div>
  );
}
