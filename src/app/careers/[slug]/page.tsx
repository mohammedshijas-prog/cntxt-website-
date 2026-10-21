import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolePage } from "@/components/careers/RolePage";
import { JsonLd, breadcrumbs, site } from "@/lib/seo";
import { openRole, openRoles } from "@/lib/supabase/server";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await openRoles()).map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const role = await openRole(slug);
  if (!role) return { title: "Careers" };
  return {
    title: `${role.title} · Careers`,
    // 120-160 characters reads best in search results.
    description: `${role.summary || `Join CNTXT AI as ${role.title}.`} ${role.location}${role.terms ? `, ${role.terms.toLowerCase()}` : ""}. Apply online at CNTXT AI.`.slice(0, 160),
    alternates: { canonical: `/careers/${role.slug}` },
  };
}

export default async function Role({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = await openRole(slug);
  if (!role) notFound();
  const remote = /remote/i.test(role.location);

  return (
    <>
      <RolePage role={role} />
      <JsonLd
        data={[
          breadcrumbs([
            { name: "Careers", path: "/careers" },
            { name: role.title, path: `/careers/${role.slug}` },
          ]),
          {
            // Google for Jobs.
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: role.title,
            description: `<p>${role.summary}</p>${role.description ? `<p>${role.description.replace(/</g, "&lt;")}</p>` : ""}`,
            datePosted: role.created_at.slice(0, 10),
            employmentType: /contract|hourly/i.test(role.terms) ? "CONTRACTOR" : "FULL_TIME",
            hiringOrganization: { "@type": "Organization", name: "CNTXT AI", sameAs: site, logo: `${site}/icon-512.png` },
            ...(remote
              ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Worldwide" } }
              : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" } } }),
            directApply: true,
            url: `${site}/careers/${role.slug}`,
          },
        ]}
      />
    </>
  );
}
