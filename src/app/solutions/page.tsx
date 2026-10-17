import type { Metadata } from "next";
import { SolutionsPage } from "@/components/solutions/SolutionsPage";

export const metadata: Metadata = {
  title: "Solutions",
  alternates: { canonical: "/solutions" },
  description: "Data services, custom AI, evaluation and Arabic voice AI for enterprises and governments, deployed on-premises, hybrid or in the cloud.",
};

export default function Solutions() {
  return (
    <div>
      <SolutionsPage />
    </div>
  );
}
