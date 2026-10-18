import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KLKT Privacy Policy",
  alternates: { canonical: "/klkt-privacy-policy" },
};

export default function KlktPrivacy() {
  return <LegalPage title="KLKT App — Privacy Policy" file="klkt-privacy-policy.html" kicker="KLKT" />;
}
