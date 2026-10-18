import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: "/terms-conditions" },
};

export default function TermsConditions() {
  return <LegalPage title="Terms and Conditions" file="terms-conditions.html" />;
}
