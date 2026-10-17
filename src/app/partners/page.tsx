import type { Metadata } from "next";
import { PartnerPage } from "@/components/partners/PartnerPage";

export const metadata: Metadata = {
  title: "Partners",
  alternates: { canonical: "/partners" },
  description:
    "Partner with CNTXT AI as a technology, delivery, data or research partner. We work with Oracle, NVIDIA, AWS, TII, AI71, Beam and Middlesex University Dubai.",
};

export default function Partners() {
  return (
    <div>
      <PartnerPage />
    </div>
  );
}
