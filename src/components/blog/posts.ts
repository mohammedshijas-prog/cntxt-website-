export const articleSlug = "five-hundred-licences";

export const categories = [
  "All",
  "3D",
  "Audio",
  "Document",
  "Geospatial",
  "Image",
  "Tabular",
  "Text",
] as const;

export type Category = (typeof categories)[number];

const blurb =
  "The demo always lands. Three months later, nobody uses it. Why enterprise AI stalls after the pilot - and the context layer that makes it compound.";

const meta = "The Zaro Team · July 1, 2026 · 7 min read";

export const featured = {
  slug: articleSlug,
  chip: "Text" as Category,
  kicker: "enterprise adoption",
  title: "Five Hundred Licences. Almost No One Uses Them.",
  blurb,
  meta,
  image: "/blog/feature.png",
};

export const cards = [
  { chip: "3D" as Category, image: "/blog/cover-poland.png" },
  { chip: "Audio" as Category, image: "/blog/cover-traffic.png" },
  { chip: "Document" as Category, image: "/blog/cover-summit.png" },
  { chip: "Geospatial" as Category, image: "/blog/cover-causes.png" },
  { chip: "Image" as Category, image: "/blog/cover-summit.png" },
  { chip: "Tabular" as Category, image: "/blog/cover-poland.png" },
].map((card, index) => ({
  id: `card-${index + 1}`,
  slug: articleSlug,
  kicker: "enterprise adoption",
  title: "Universal Music Group and ElevenLabs",
  blurb,
  meta,
  ...card,
}));

export const article = {
  kicker: "enterprise adoption",
  title: ["Five Hundred Licenses.", "Almost No One Uses Them."],
  meta: "The Zaro Team · July 15, 2026 · 6 min read",
  paragraphs: [
    "Stop us if this sounds familiar. Procurement approves the rollout. Licences go out to everyone. Three months later, a handful of people use it daily, most people opened it once, and finance is asking why the bill keeps climbing while usage keeps falling.",
    "Read that two ways and you get two different stories. Glass half full: hundreds of people picked up a brand-new tool inside a single quarter, faster than most companies ever roll out new software. Glass half empty: after three months, most of those same people have quietly stopped opening it. Both readings are true at once, and the gap between them is the only number in the whole rollout worth caring about.",
    "We stopped calling this a rollout problem a while ago. The tool did exactly what it was built to do. What broke down was the assumption that change management and training could stand in for infrastructure the business never built. Give that same rollout the best trainers and most patient change managers in the world, and the best-trained user still opens a blank session every morning, re-explaining what the team already knows. Training makes someone skilled at using the tool. It does nothing about the tool forgetting them between sessions. No amount of user skill fixes that.",
  ],
  subhead: "The Individual Tool, Doing Its Job",
  topics: [
    "Enterprise Adoption",
    "Change Management",
    "Digital Transformation",
    "Team Enablement",
    "Product Strategy",
  ],
};

export const readNext = [
  { image: "/blog/cover-causes.png", under: "/blog/cover-poland.png" },
  { image: "/blog/cover-traffic.png", under: "/blog/card-base.png" },
  { image: "/blog/cover-causes.png", under: "/blog/cover-summit.png" },
];
