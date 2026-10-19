import type { Metadata } from "next";
import { JsonLd, breadcrumbs, service } from "@/lib/seo";
import { DataServicesPage } from "@/components/data-services/DataServicesPage";

export const metadata: Metadata = {
  title: "Data-as-a-service",
  alternates: { canonical: "/data-services" },
  description:
    "CNTXT data services: collection, annotation at 98% accuracy, expert evaluation and physical-AI data, with native Arabic annotators across 25+ dialects.",
};

export default function DataServices() {
  return (
    <>
      <DataServicesPage />
      <JsonLd
        data={[
          breadcrumbs([{ name: "Data-as-a-service", path: "/data-services" }]),
          service({
            name: "Data-as-a-service",
            description:
              "Data collection, annotation at 98% accuracy with human-in-the-loop quality checks, expert AI evaluation and physical-AI data, with native Arabic annotators across 25+ dialects.",
            path: "/data-services",
          }),
        ]}
      />
    </>
  );
}
