import type { Metadata } from "next";
import { isValidElement, type ReactNode } from "react";
import { KlktLanding, faqs } from "@/components/legacy/KlktLanding";
import { JsonLd, breadcrumbs, site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "KLKT: get paid for everyday tasks",
  alternates: { canonical: "/ai-klkt" },
  description:
    "Pick a task, do it on your phone, get paid for what is accepted. KLKT is built by CNTXT AI, a company based in Abu Dhabi. Free to join, always.",
};

/** The plain text of an answer, for FAQ structured data (the page keeps its links). */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export default function AiKlkt() {
  return (
    <>
      <KlktLanding />
      <JsonLd
        data={[
          breadcrumbs([{ name: "KLKT", path: "/ai-klkt" }]),
          {
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "KLKT",
            operatingSystem: "iOS, Android",
            applicationCategory: "BusinessApplication",
            description: "Record everyday work or photograph handwritten pages, and get paid in US dollars for every accepted submission. Free to join.",
            url: "https://klkt.app",
            publisher: { "@id": `${site}/#organization` },
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: textOf(item.a).replace(/\s+/g, " ").trim() },
            })),
          },
        ]}
      />
    </>
  );
}
