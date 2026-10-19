import type { Metadata } from "next";
import { JsonLd, breadcrumbs, service } from "@/lib/seo";
import { notFound } from "next/navigation";
import { VerticalPage } from "@/components/physical-ai/VerticalPage";
import { findVertical, verticals } from "@/components/physical-ai/verticals";

export function generateStaticParams() {
  return verticals.map((vertical) => ({ slug: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = findVertical(slug);
  if (!vertical) return { title: "Physical AI" };
  return {
    title: `${vertical.name} data`,
    description: vertical.lead,
    alternates: { canonical: `/physical-ai/${vertical.slug}` },
  };
}

export default async function Vertical({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = findVertical(slug);
  if (!vertical) notFound();
  return (
    <>
      <VerticalPage vertical={vertical} />
      <JsonLd
        data={[
          breadcrumbs([
            { name: "Physical AI", path: "/physical-ai" },
            { name: vertical.name, path: `/physical-ai/${vertical.slug}` },
          ]),
          service({ name: `${vertical.name} training data`, description: vertical.lead, path: `/physical-ai/${vertical.slug}` }),
        ]}
      />
    </>
  );
}
