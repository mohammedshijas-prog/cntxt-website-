import type { Metadata } from "next";
import { KlktPage } from "@/components/klkt/KlktPage";

export const metadata: Metadata = {
  title: "KLKT | CNTXT AI",
  description: "KLKT – Turn any workflow into an AI app.",
};

export default function Klkt() {
  return (
    <div>
      <KlktPage />
    </div>
  );
}
