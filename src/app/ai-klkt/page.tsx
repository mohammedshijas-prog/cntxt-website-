import type { Metadata } from "next";
import { KlktLanding } from "@/components/legacy/KlktLanding";

export const metadata: Metadata = {
  title: "KLKT: get paid for everyday tasks",
  alternates: { canonical: "/ai-klkt" },
  description:
    "Pick a task, do it on your phone, get paid for what is accepted. KLKT is built by CNTXT AI, a company based in Abu Dhabi. Free to join, always.",
};

export default function AiKlkt() {
  return <KlktLanding />;
}
