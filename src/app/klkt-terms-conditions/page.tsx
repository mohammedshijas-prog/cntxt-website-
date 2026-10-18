import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KLKT Terms & Conditions",
  alternates: { canonical: "/klkt-terms-conditions" },
};

export default function KlktTerms() {
  return <LegalPage title="KLKT App — Terms and Conditions" file="klkt-terms-conditions.html" kicker="KLKT" />;
}
