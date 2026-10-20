import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { DataHubPage } from "@/components/data-hub/DataHubPage";
import { publishedDatasets } from "@/lib/supabase/server";

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
  // The catalogue is managed in the portal.
  const datasets = (await publishedDatasets()).map(({ id, title, kind, category: modality, blurb, capture, labels, sample_url, sample_name }) => ({
    id,
    title,
    kind,
    category: modality,
    blurb,
    capture,
    labels,
    sample_url,
    sample_name,
  }));
  return (
    <div className={geistMono.variable}>
      <DataHubPage initialCategory={typeof category === "string" ? category : undefined} datasets={datasets} />
    </div>
  );
}
