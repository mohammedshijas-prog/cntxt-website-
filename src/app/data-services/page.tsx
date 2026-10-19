import type { Metadata } from "next";
import { DataServicesPage } from "@/components/data-services/DataServicesPage";

export const metadata: Metadata = {
  title: "Data-as-a-service",
  alternates: { canonical: "/data-services" },
  description:
    "CNTXT data services: collection, annotation at 98% accuracy, expert evaluation and physical-AI data, with native Arabic annotators across 25+ dialects.",
};

export default function DataServices() {
  return <DataServicesPage />;
}
