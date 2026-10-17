import type { Metadata } from "next";
import { PhysicalAiPage } from "@/components/physical-ai/PhysicalAiPage";

export const metadata: Metadata = {
  title: "Physical AI data",
  alternates: { canonical: "/physical-ai" },
  description:
    "First-person video of real work, recorded with consent, checked by people and labelled for robotics training.",
};

export default function PhysicalAi() {
  return (
    <div>
      <PhysicalAiPage />
    </div>
  );
}
