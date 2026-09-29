import type { Metadata } from "next";
import { PartnerPage } from "@/components/partners/PartnerPage";

export const metadata: Metadata = {
  title: "Partners | CNTXT AI",
  description:
    "Who we partner with and why — integrators, data partners, cloud & hardware, research.",
};

export default function Partners() {
  return (
    <div>
      <PartnerPage />
    </div>
  );
}
