import type { Metadata } from "next";
import { SecurityPage } from "@/components/security/SecurityPage";

export const metadata: Metadata = {
  title: "Security",
  alternates: { canonical: "/security" },
  description:
    "Security and data sovereignty, by design. SOC 2 Type II, ISO 27001, GDPR and HIPAA, with in-region hosting and on-premises, hybrid or cloud deployment.",
};

export default function Security() {
  return (
    <div>
      <SecurityPage />
    </div>
  );
}
