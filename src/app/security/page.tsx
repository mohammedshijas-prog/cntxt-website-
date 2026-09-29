import type { Metadata } from "next";
import { SecurityPage } from "@/components/security/SecurityPage";

export const metadata: Metadata = {
  title: "Security | CNTXT AI",
  description:
    "Security and data sovereignty, by design. Enterprise-grade security, governance, and compliance at every layer.",
};

export default function Security() {
  return (
    <div>
      <SecurityPage />
    </div>
  );
}
