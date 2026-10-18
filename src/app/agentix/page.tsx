import type { Metadata } from "next";
import { AgentixPage } from "@/components/agentix/AgentixPage";

export const metadata: Metadata = {
  title: "Agentix",
  alternates: { canonical: "/agentix" },
  description:
    "Agentix: Arabic voice and chat agents with GCC telephony that answer customers in their dialect and complete the task.",
};

export default function Agentix() {
  return <AgentixPage />;
}
