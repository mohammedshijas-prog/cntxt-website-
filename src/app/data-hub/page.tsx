import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { DataHubPage } from "@/components/data-hub/DataHubPage";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Data Hub",
  alternates: { canonical: "/data-hub" },
  description:
    "Arabic speech, handwritten pages, first-person video of everyday work, and labelled text, image, video and LiDAR data. Request a category or a custom collection.",
};

export default async function DataHub({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  // Menu links such as /data-hub?category=Audio open with that category chosen.
  const { category } = await searchParams;
  return (
    <div className={geistMono.variable}>
      <DataHubPage initialCategory={typeof category === "string" ? category : undefined} />
    </div>
  );
}
