import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicy() {
  return <LegalPage title="Cookie Policy" file="cookie-policy.html" />;
}
