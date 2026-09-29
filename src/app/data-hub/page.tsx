import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { DataHubPage } from "@/components/data-hub/DataHubPage";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Data Hub | CNTXT AI",
  description:
    "Browse curated datasets collected and annotated by cntxt. Request access or a custom collection.",
};

export default function DataHub() {
  return (
    <div className={geistMono.variable}>
      <DataHubPage />
    </div>
  );
}
