import type { Metadata } from "next";
import { AgentixPage } from "@/components/agentix/AgentixPage";

export const metadata: Metadata = {
  title: "Agentix",
  alternates: { canonical: "/agentix" },
  description:
    "Agentix is CNTXT's conversational AI platform: Arabic voice and chat agents, workflow automation and GCC telephony, in the cloud or on-premises.",
};

export default function Agentix() {
  return (
    <div>
      <AgentixPage />
    </div>
  );
}
