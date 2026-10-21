import type { Metadata } from "next";
import { AgentixPage } from "@/components/agentix/AgentixPage";
import { JsonLd, breadcrumbs, site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Agentix",
  alternates: { canonical: "/agentix" },
  description:
    "Agentix: Arabic voice and chat agents with GCC telephony that answer customers in their dialect and complete the task.",
};

export default function Agentix() {
  return (
    <>
      <AgentixPage />
      <JsonLd
        data={[
          breadcrumbs([
            { name: "AI Lab", path: "/products" },
            { name: "Agentix", path: "/agentix" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Agentix",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Arabic voice and chat agents that answer customers in their dialect across voice, WhatsApp, web chat, app, email and SMS, on GCC phone lines.",
            url: `${site}/agentix`,
            publisher: { "@id": `${site}/#organization` },
            inLanguage: ["ar", "en", "hi", "fr"],
          },
        ]}
      />
    </>
  );
}
