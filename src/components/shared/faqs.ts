/*
 * Buyer questions per page. Every answer restates a fact from
 * docs/content-brief.md; nothing here is new information.
 */

export type FaqItem = { q: string; a: string };

const deployment: FaqItem = {
  q: "Can you deploy on our own infrastructure?",
  a: "Yes. We deploy on-premises, hybrid or in the cloud, and hosting and processing can be kept in region.",
};

const certifications: FaqItem = {
  q: "Which security certifications do you hold?",
  a: "CNTXT AI holds SOC 2 Type II and ISO 27001. GDPR and HIPAA are listed in our trust centre at cntxt.trust.site, with the controls behind them.",
};

const projectStart: FaqItem = {
  q: "How does a project start?",
  a: "With discovery: the problem, the systems it touches and the data behind it. That becomes a roadmap, then a first build phase, a review, a second build phase and sign-off.",
};

export const faqs = {
  products: [
    {
      q: "Can we use one layer on its own?",
      a: "Yes. Data services, Munsit and Agentix are each available separately.",
    },
    {
      q: "What does the data layer cover?",
      a: "Sourcing and collection, labelling of text, image, video and audio at 98% accuracy with human-in-the-loop quality checks, and physical-AI data recorded from real work.",
    },
    projectStart,
    deployment,
  ],
  physicalAi: [
    {
      q: "What kind of data do you capture?",
      a: "First-person video of real work: picking, packing and shelf stocking in warehouses, kitchen work, housekeeping, laundry and cleaning, and hospital portering. We also capture photographs of handwritten Arabic pages.",
    },
    {
      q: "How is it recorded?",
      a: "Hands-free, with a phone sideways on a head strap, the Roboband headband (up to eight synced cameras) or the wristband camera. Phone recording works on iPhone 11 to 17, Pixel 6 to 9, Galaxy S21 to S24 and more.",
    },
    {
      q: "How do you handle consent and privacy?",
      a: "Every worker agrees before recording, in Arabic, English, Filipino or Urdu. We never process content to identify anyone.",
    },
    {
      q: "How do you check quality?",
      a: "A person reviews every recorded hour. Only accepted hours are paid for and delivered, and labelling is checked with a human in the loop.",
    },
    {
      q: "Have you delivered at scale?",
      a: "Yes. We delivered 1.8 million precisely annotated frames in six months to a leading GCC robotics lab training humanoid robots for restaurant and kitchen work.",
    },
    {
      q: "Can you label data we already have?",
      a: "Yes. Our annotators label video actions frame by frame, and handle LiDAR, bounding boxes and segmentation masks.",
    },
  ],
  dataServices: [
    {
      q: "How is this different from the data catalogue?",
      a: "The catalogue lists ready-made data categories you can add to a request. Data services is a managed project: we source, label, review and evaluate data to your specification.",
    },
    {
      q: "How accurate is the labelling?",
      a: "Text, image, video and audio are labelled at 98% accuracy, with human-in-the-loop quality assurance on every project.",
    },
    {
      q: "Who does the work?",
      a: "Native Arabic annotators across 25+ dialects, domain experts in finance, healthcare, logistics and government, and human AI evaluators in biology, medicine, finance, coding and bilingual work.",
    },
    projectStart,
  ],
  dataHub: [
    {
      q: "How do I request data?",
      a: "Add the categories you need to your request, then send it. The contact form opens with your list filled in. You can also ask for a custom collection.",
    },
    {
      q: "Can you collect data that is not listed?",
      a: "Yes. We source domain-specific datasets, collect in the field, integrate with enterprise systems and generate synthetic data in controlled environments.",
    },
    {
      q: "How accurate is the labelling?",
      a: "Text, image, video and audio are labelled at 98% accuracy, with human-in-the-loop quality assurance.",
    },
    {
      q: "Which Arabic dialects do your annotators cover?",
      a: "More than 25, including Gulf, Egyptian, Levantine and Maghrebi Arabic.",
    },
    {
      q: "Where is the data stored?",
      a: "Hosting and processing can be kept in region to meet data-residency requirements.",
    },
  ],
  security: [
    certifications,
    {
      q: "Where is our data hosted and processed?",
      a: "In region. Deployments can be configured to meet regional data-residency requirements such as the UAE and Saudi PDPL.",
    },
    deployment,
    {
      q: "Where can I see your controls and policies?",
      a: "In our trust centre at cntxt.trust.site, which lists the controls across product, data, network, app, endpoint and corporate security.",
    },
    {
      q: "How do I report a security issue?",
      a: "Send the details through our contact page and the team will follow up.",
    },
  ],
  solutions: [
    {
      q: "Do we have to replace our existing systems?",
      a: "No. AI is deployed into the systems and workflows you already run, without a migration.",
    },
    projectStart,
    deployment,
    {
      q: "Which industries do you work with?",
      a: "Finance, the public sector, healthcare, real estate, insurance and logistics, as well as robotics teams that need physical-AI data.",
    },
    certifications,
  ],
  healthcare: [
    {
      q: "Are you HIPAA compliant?",
      a: "HIPAA is listed in our trust centre, alongside SOC 2 Type II, ISO 27001 and GDPR.",
    },
    {
      q: "Who evaluates medical AI?",
      a: "Evaluators with medical and biology expertise test and audit models for bias, reliability and compliance before deployment.",
    },
    {
      q: "Can Munsit transcribe clinical Arabic?",
      a: "Munsit transcribes and voices Arabic across more than 25 dialects, through an API or on-premises.",
    },
    deployment,
  ],
  partners: [
    {
      q: "What kinds of partners do you work with?",
      a: "Technology and cloud partners, commercial and delivery partners, data partners who help capture and label real-world data, and research partners.",
    },
    {
      q: "Who are your current partners?",
      a: "Oracle, NVIDIA and AWS for technology, with CNTXT a member of NVIDIA Inception, and TII, AI71, Beam and Middlesex University Dubai for research and ecosystem work.",
    },
    {
      q: "How do I apply?",
      a: "Use the form on this page: tell us what you do, where you operate and how you would like to work together.",
    },
  ],
  careers: [
    {
      q: "Are the roles remote?",
      a: "AI evaluator, coding expert and bilingual annotator roles are remote, on an hourly contract. Robotics data collection roles are based in several countries.",
    },
    {
      q: "How do I apply?",
      a: "Choose a role and apply through our application page at cntxt.tech/career.",
    },
    {
      q: "What support do new joiners get?",
      a: "Mentorship, hands-on projects and professional certifications, with remote and on-site options.",
    },
  ],
} satisfies Record<string, FaqItem[]>;

/** Questions shared by every industry page, after its own. */
export const industryFaqs: FaqItem[] = [
  {
    q: "Do we have to replace our existing systems?",
    a: "No. AI is deployed into the systems and workflows you already run, without a migration.",
  },
  projectStart,
  deployment,
  certifications,
];
