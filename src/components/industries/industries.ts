/*
 * Industry pages. Every figure and claim here is taken from CNTXT's own
 * published pages and use cases (see docs/content-brief.md, section 7).
 */

import type { FaqItem } from "../shared/faqs";

export type Industry = {
  slug: string;
  name: string;
  /** Contact-form topic this page's buttons preselect. */
  topic: string;
  eyebrow: string;
  /** A photo of the work this industry does, used in the hero and the industry cards. */
  image: string;
  title: string;
  lead: string;
  description: string;
  results: { value: string; label: string }[];
  problemsTitle: string;
  problems: string[];
  /** For each problem, the index of the solution that fixes it. */
  fixes: number[];
  solutionsTitle: string;
  solutions: { icon: "check" | "lock" | "globe" | "loop" | "floor" | "consent"; title: string; body: string }[];
  study: {
    sector: string;
    title: string;
    challenge: string;
    solution: string;
    stats: { value: string; label: string }[];
  };
  quote?: { text: string; name: string; role: string; photo: string };
  /** Questions specific to this industry; shared ones are added by the page. */
  faq?: FaqItem[];
};

export const industries: Industry[] = [
  {
    slug: "financial-services",
    faq: [
      { q: "Can our data stay in the UAE?", a: "Yes. Hosting and processing can be kept inside UAE jurisdiction, aligned with the UAE PDPL." },
      { q: "What can the AI be trained on?", a: "Your own KYC files, VAT records, contracts and identity documents." },
    ],
    name: "Financial services",
    topic: "Custom AI solutions",
    eyebrow: "Financial services",
    image: "/healthcare/tile-chart.webp",
    title: "Build your own AI for financial institutions, end to end.",
    lead: "AI trained on your KYC files, VAT records, contracts and IDs, deployed into the systems you already run, with every byte kept inside UAE jurisdiction.",
    description:
      "Custom AI for banks and financial institutions: document training, automated KYC, VAT and contract reviews, UAE data residency.",
    results: [
      { value: "85%", label: "Faster review cycles" },
      { value: "60%", label: "Fewer manual checks" },
      { value: "50–70%", label: "Lower operating costs" },
    ],
    problemsTitle: "Where generic AI breaks in finance.",
    fixes: [0, 1, 1, 3, 2],
    problems: [
      "Extraction errors of 30–45% or more on financial documents.",
      "KYC logic misread, which raises both false negatives and false positives.",
      "VAT and contract reviews slowed by manual checks.",
      "Legacy systems that break integrations and stall deployment.",
      "Data flows that are non-compliant because nothing is resident in the UAE.",
    ],
    solutionsTitle: "What we build for financial institutions.",
    solutions: [
      { icon: "floor", title: "AI trained on your documents", body: "Models learn from your own KYC files, VAT records, contracts and identity documents." },
      { icon: "check", title: "Automated reviews", body: "KYC, VAT and contract reviews run automatically, with people checking the exceptions." },
      { icon: "globe", title: "Data inside UAE jurisdiction", body: "Hosting and processing stay in the UAE, aligned with the UAE PDPL." },
      { icon: "loop", title: "No migration needed", body: "AI is deployed into your existing systems and workflows instead of replacing them." },
    ],
    study: {
      sector: "Financial services & regulation",
      title: "Judicial claims processing for a leading financial jurisdiction.",
      challenge:
        "A manual small-claims process had a 40% error rate, and legal teams spent 70% of their time on routine validation instead of case analysis.",
      solution:
        "A custom AI assistant gives claimants real-time guidance and validation. It is deployed entirely within UAE borders.",
      stats: [
        { value: "83%", label: "Less processing time" },
        { value: "64%", label: "Less legal workload" },
        { value: "78%", label: "Projected cost savings" },
      ],
    },
    quote: {
      text: "The speed at which CNTXT AI operates is unmatched for a company of its scale.",
      name: "Youssef Salem",
      role: "CFO, ADNOC Drilling",
      photo: "/brand/people/youssef-salem.webp",
    },
  },
  {
    slug: "public-sector",
    faq: [
      { q: "Where is government data hosted?", a: "In national or GCC infrastructure under government control, on-premises or in a sovereign cloud." },
      { q: "What can the AI be trained on?", a: "Policies, procedures, regulations, directives, internal guidance, reports and circulars." },
    ],
    name: "Public sector",
    topic: "Custom AI solutions",
    eyebrow: "Government & public sector",
    image: "/industries/government.jpg",
    title: "AI built for government operations.",
    lead: "Secure, sovereign and designed for public service. Trained on your policies and regulations, fluent in Arabic, and run on infrastructure the government controls.",
    description:
      "Sovereign AI for government: trained on official documents, deployed on-premises or in a sovereign cloud, with data kept in national or GCC infrastructure.",
    results: [
      { value: "85%", label: "Fewer manual operational reviews" },
      { value: "60%", label: "Faster execution across key processes" },
      { value: "50%", label: "Lower operational, legal and compliance risk" },
    ],
    problemsTitle: "Why generic AI fails in government.",
    fixes: [0, 1, 0, 3, 2],
    problems: [
      "It does not match government operating models or terminology.",
      "It cannot reason reliably over laws, regulations and official records.",
      "It does not reliably support Arabic, local context and usage.",
      "It fails national security and data-residency requirements.",
      "It is built for general use, not for public-sector operations.",
    ],
    solutionsTitle: "What we build for government.",
    solutions: [
      { icon: "floor", title: "AI trained on government documents", body: "Policies, procedures, regulations, directives, internal guidance, reports and circulars." },
      { icon: "check", title: "Regulatory and contract work", body: "Reviews of contracts, procurement documents and MOUs, plus support for compliance checks." },
      { icon: "loop", title: "Works with existing systems", body: "AI runs inside current platforms and workflows, with no system replacement." },
      { icon: "lock", title: "Sovereign deployment", body: "On-premises or sovereign cloud. Data stays in national or GCC infrastructure under government control." },
    ],
    study: {
      sector: "Defence",
      title: "Mission-critical data unification for a military entity.",
      challenge:
        "Thirty sub-entities each kept their own data systems, protocols and security postures, which left gaps in cross-functional coordination and planning.",
      solution:
        "A secure on-premises data platform unified them and made the organisation ready for AI while meeting military compliance requirements.",
      stats: [
        { value: "30", label: "Sub-entities unified" },
        { value: "100%", label: "On-premises deployment" },
      ],
    },
    quote: {
      text: "CNTXT AI capabilities and speed of execution stand out in this fast-moving AI world.",
      name: "Reda Nidhakou",
      role: "AI71, investor in CNTXT AI",
      photo: "/brand/people/reda-nidhakou.webp",
    },
  },
  {
    slug: "real-estate",
    faq: [
      { q: "What goes into the data foundation?", a: "Sales, finance, HR and marketing data, brought out of a partial CRM, scattered spreadsheets and ad-hoc folders into one system." },
    ],
    name: "Real estate",
    topic: "Custom AI solutions",
    eyebrow: "Real estate & proptech",
    image: "/solutions/study-4.webp",
    title: "One data foundation for the whole brokerage.",
    lead: "We unify the CRM, the spreadsheets and the document folders, then put AI to work on lead scoring, pricing and demand forecasting.",
    description:
      "Data foundation and custom AI for real estate: unified data, lead scoring, pricing and demand forecasting.",
    results: [
      { value: "22%", label: "Faster reviews" },
      { value: "28%", label: "Less legal workload" },
    ],
    problemsTitle: "What holds real estate teams back.",
    fixes: [0, 0, 3, 1],
    problems: [
      "A CRM that is only partly implemented.",
      "Deals and leads tracked in scattered Excel files.",
      "Documents managed ad hoc, team by team.",
      "Slow lead response and inconsistent property valuation.",
    ],
    solutionsTitle: "What we build for real estate.",
    solutions: [
      { icon: "loop", title: "Centralised data", body: "Sales, finance, HR and marketing data brought into one system." },
      { icon: "check", title: "Lead scoring", body: "Enriched data ranks leads so teams respond to the right ones first." },
      { icon: "floor", title: "Pricing and forecasting", body: "Models support property pricing and demand forecasting." },
      { icon: "consent", title: "Faster legal review", body: "AI-assisted document review shortens review cycles and reduces legal workload." },
    ],
    study: {
      sector: "Real estate & proptech",
      title: "Data foundation and AI enablement for an Abu Dhabi brokerage.",
      challenge:
        "A leading mid-market brokerage was held back by fragmented technology: a partial CRM, decentralised Excel tracking and ad-hoc document management.",
      solution:
        "We implemented a centralised data system and deployed custom AI tools for decisions across sales, finance, HR and marketing.",
      stats: [
        { value: "22%", label: "Faster reviews" },
        { value: "28%", label: "Less legal workload" },
      ],
    },
    quote: {
      text: "Working with CNTXT AI has been an incredibly rewarding experience.",
      name: "Ameen Al Qudsi",
      role: "CEO, Nationwide Middle East Properties",
      photo: "/brand/people/ameen-al-qudsi.webp",
    },
  },
  {
    slug: "insurance",
    faq: [
      { q: "How does real-time validation work?", a: "AI checks each claim as it is entered and flags what is missing or wrong, before it is submitted." },
    ],
    name: "Insurance",
    topic: "Custom AI solutions",
    eyebrow: "Insurance",
    image: "/security/practice-a.png",
    title: "Claims that are right the first time.",
    lead: "Real-time AI validation catches errors while a claim is being submitted, so fewer are rejected and reviewers spend their time on the hard cases.",
    description:
      "AI claims processing for insurers: real-time validation, integrated chat and automated review.",
    results: [
      { value: "72%", label: "Fewer rejected claims (estimated)" },
      { value: "60%", label: "Less processing time" },
    ],
    problemsTitle: "Where claims go wrong.",
    fixes: [1, 0, 0],
    problems: [
      "Submission portals with complex interfaces.",
      "Manual submission steps with no validation.",
      "Rejection rates above 70% on first submission.",
    ],
    solutionsTitle: "What we build for insurers.",
    solutions: [
      { icon: "check", title: "Real-time validation", body: "AI checks each claim as it is entered and flags what is missing or wrong." },
      { icon: "consent", title: "Guided submission", body: "A clearer interface with integrated chat helps people complete a claim correctly." },
      { icon: "loop", title: "Automated review", body: "Routine checks run automatically, so reviewers handle the exceptions." },
    ],
    study: {
      sector: "Insurance",
      title: "AI claims processing for a claims portal.",
      challenge:
        "The portal's rejection rate was above 70%, driven by a complex interface and manual submission.",
      solution:
        "A user-friendly interface with real-time AI validation, integrated chat and automated review.",
      stats: [
        { value: "70%+", label: "Of claims were rejected before the project" },
        { value: "72%", label: "Estimated cut in the rejection rate" },
        { value: "60%", label: "Less processing time" },
      ],
    },
  },
];

export function findIndustry(slug: string) {
  return industries.find((item) => item.slug === slug);
}
