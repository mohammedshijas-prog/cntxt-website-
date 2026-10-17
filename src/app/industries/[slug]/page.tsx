import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage } from "@/components/industries/IndustryPage";
import { findIndustry, industries } from "@/components/industries/industries";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) return { title: "Industries" };
  return {
    title: industry.name,
    description: industry.description,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function Industry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) notFound();

  return (
    <div>
      <IndustryPage industry={industry} />
    </div>
  );
}
