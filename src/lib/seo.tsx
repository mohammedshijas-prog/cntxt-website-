/*
 * Structured data for search and AI answer engines. Every fact restates
 * docs/content-brief.md; nothing here is new information.
 */

export const site = "https://www.cntxt.tech";

/** Renders schema.org JSON-LD, escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site}/#organization`,
  name: "CNTXT AI",
  alternateName: "CNTXT",
  url: site,
  logo: `${site}/icon-512.png`,
  description:
    "UAE-based data and AI company headquartered in Abu Dhabi. CNTXT AI captures and verifies data from real work, trains models on it and deploys Arabic-first AI on-premises, hybrid or in the cloud for enterprises and governments.",
  address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
  founder: [
    { "@type": "Person", name: "Mohammad Abu Sheikh", jobTitle: "Co-Founder & CEO" },
    { "@type": "Person", name: "Hassan Abu Sheikh", jobTitle: "Co-Founder" },
  ],
  email: "sales@cntxt.tech",
  sameAs: ["https://www.linkedin.com/company/cntxtai", "https://www.instagram.com/cntxt.ai"],
  knowsAbout: [
    "Arabic speech recognition",
    "Arabic dialects",
    "Data annotation",
    "Physical AI training data",
    "AI evaluation",
    "On-premises AI deployment",
  ],
  brand: [
    { "@type": "Brand", name: "Munsit", url: "https://munsit.com" },
    { "@type": "Brand", name: "KLKT", url: "https://klkt.app" },
    { "@type": "Brand", name: "Agentix", url: `${site}/agentix` },
  ],
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site}/#website`,
  name: "CNTXT AI",
  url: site,
  inLanguage: "en",
  publisher: { "@id": `${site}/#organization` },
};

/** Home › … › page, for breadcrumb rich results. */
export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site}${item.path}`,
    })),
  };
}

/** A service CNTXT offers, attributed to the organisation. */
export function service({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site}${path}`,
    provider: { "@id": `${site}/#organization` },
    areaServed: "GCC",
  };
}

export function article({
  title,
  description,
  path,
  image,
  published,
  modified,
  author = "CNTXT AI",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  published?: string | null;
  modified?: string | null;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${site}${path}`,
    ...(image ? { image: image.startsWith("http") ? image : `${site}${image}` } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: { "@type": "Organization", name: author },
    publisher: { "@id": `${site}/#organization` },
  };
}
