/*
 * Physical AI verticals. Every claim comes from docs/content-brief.md
 * (physical AI data, KLKT, data services); nothing is specific to a customer
 * beyond the published 1.8M-frame robotics case.
 */

export type Vertical = {
  slug: string;
  name: string;
  /** Line art used on the home cards and this page's hero. */
  art: string;
  title: string;
  lead: string;
  problemTitle: string;
  problem: string;
  capabilities: { icon: "camera" | "check" | "consent" | "loop" | "globe" | "lock" | "image" | "lidar" | "floor"; title: string; body: string }[];
  samples: { src: string; label: string; tag: string }[];
  dataTypes: string[];
  /** Data Hub category the samples link to. */
  hubCategory: string;
};

const clips = {
  reach: { src: "/art/ego-aisle-reach.webp", label: "Reach into the rack", tag: "First-person video" },
  pick: { src: "/art/ego-shelf-pick.webp", label: "Pick a carton", tag: "Action labels" },
  place: { src: "/art/ego-shelf-place.webp", label: "Place on the shelf", tag: "Hand and object marks" },
  trolley: { src: "/art/ego-trolley.webp", label: "Push the trolley", tag: "First-person video" },
  vials: { src: "/art/ego-vials.webp", label: "Sort the vials", tag: "Fine manipulation" },
  panel: { src: "/art/ego-control-panel.webp", label: "Operate the panel", tag: "Action labels" },
  frame: { src: "/art/frame-shelf.webp", label: "Annotated frame", tag: "Bounding boxes" },
};

const shared = {
  consent: {
    icon: "consent" as const,
    title: "Consent in four languages",
    body: "Workers read and agree to the terms in Arabic, English, Filipino or Urdu before anything is recorded.",
  },
  review: {
    icon: "check" as const,
    title: "A person reviews every hour",
    body: "Acceptance is decided by a person, and labelling is checked with a human in the loop at 98% accuracy.",
  },
  region: {
    icon: "globe" as const,
    title: "In region when you need it",
    body: "Data can be hosted and processed in region to meet data-residency requirements.",
  },
};

export const verticals: Vertical[] = [
  {
    slug: "robotics-humanoids",
    name: "Robotics & humanoids",
    art: "/art/lines/humanoids.webp",
    title: "Teach robots the tasks people do every day.",
    lead: "First-person video of real work, broken into the actions a robot has to learn, with hands, objects and steps marked up.",
    problemTitle: "Lab demonstrations don't look like real work.",
    problem: "A few tidy tasks recorded in a lab leave robots unprepared for cluttered, busy floors that change every day. Manipulation models need the real thing, at volume.",
    capabilities: [
      { icon: "camera", title: "Hands-free capture", body: "A phone on a head strap, the Roboband camera headband or the wristband camera, so both hands stay on the task." },
      { icon: "image", title: "Action-level labels", body: "Accepted clips are broken into the steps a robot has to learn, with hands and objects marked up." },
      shared.review,
      shared.consent,
    ],
    samples: [clips.pick, clips.place, clips.vials, clips.frame],
    dataTypes: ["First-person video", "Wrist-camera video", "Action labels", "Hand and object marks", "Bounding boxes", "Segmentation masks"],
    hubCategory: "Video",
  },
  {
    slug: "world-models",
    name: "World models & foundation models",
    art: "/art/lines/world.webp",
    title: "Real-world footage for models that learn how the world works.",
    lead: "Large volumes of first-person video from warehouses, kitchens, hotels and hospitals, recorded with consent and reviewed by people.",
    problemTitle: "Foundation models run out of real-world data.",
    problem: "Models that predict how the physical world behaves need far more varied, real footage than any one lab can stage. Variety of places, people and tasks matters as much as volume.",
    capabilities: [
      { icon: "floor", title: "Many real environments", body: "Warehouses, kitchens, hotels and hospitals, each different every day." },
      { icon: "loop", title: "A capture network", body: "KLKT puts recording in people's pockets, so collection scales with the network, not a studio." },
      shared.review,
      shared.region,
    ],
    samples: [clips.reach, clips.trolley, clips.panel, clips.place],
    dataTypes: ["First-person video", "Wrist-camera video", "Multi-environment footage", "Action labels"],
    hubCategory: "Video",
  },
  {
    slug: "autonomous-systems",
    name: "Autonomous systems & perception",
    art: "/art/lines/perception.webp",
    title: "Perception data, labelled by people who check their work.",
    lead: "LiDAR, bounding boxes and segmentation masks, labelled with human-in-the-loop quality checks at 98% accuracy.",
    problemTitle: "Perception fails on what it was never shown.",
    problem: "Autonomous systems stumble on the cases their training data missed. Labels have to be accurate and consistent, and checked by people, before they reach a training run.",
    capabilities: [
      { icon: "lidar", title: "LiDAR annotation", body: "Point clouds labelled alongside camera frames, by trained annotators." },
      { icon: "image", title: "Boxes and masks", body: "Bounding boxes and segmentation masks with human-in-the-loop quality checks." },
      shared.review,
      shared.region,
    ],
    samples: [clips.frame, clips.reach, clips.trolley, clips.panel],
    dataTypes: ["LiDAR", "Camera frames", "Bounding boxes", "Segmentation masks", "Video"],
    hubCategory: "3D",
  },
  {
    slug: "logistics-warehousing",
    name: "Logistics & warehousing",
    art: "/art/lines/warehouses.webp",
    title: "Picking, packing and stocking, recorded on real floors.",
    lead: "Warehouse work recorded first-person and broken into the steps a warehouse robot has to learn.",
    problemTitle: "Every warehouse is different.",
    problem: "Shelves, cartons and layouts change from site to site and shift to shift. Robots trained on one tidy set-up struggle on the next real floor.",
    capabilities: [
      { icon: "camera", title: "Recorded during real shifts", body: "Workers record picking, packing and shelf stocking as they already do it." },
      { icon: "image", title: "Step-by-step labels", body: "Each clip is broken into reach, grasp, move and place, with objects marked up." },
      shared.review,
      shared.consent,
    ],
    samples: [clips.reach, clips.pick, clips.place, clips.frame],
    dataTypes: ["First-person video", "Wrist-camera video", "Action labels", "Bounding boxes"],
    hubCategory: "Video",
  },
  {
    slug: "healthcare-service-robotics",
    name: "Healthcare & service robotics",
    art: "/art/lines/hospitals.webp",
    title: "Data for robots that assist where people care for others.",
    lead: "Hospital portering, housekeeping and kitchen work, captured with consent and reviewed by people.",
    problemTitle: "Service work is close, careful and varied.",
    problem: "Robots that help on a ward, in a hotel or in a kitchen work around people. They need data recorded in those places, with consent, and checked before anyone trains on it.",
    capabilities: [
      { icon: "floor", title: "Hospitals, hotels, kitchens", body: "Portering and support work, housekeeping and laundry, line cooking and kitchen portering." },
      shared.consent,
      shared.review,
      shared.region,
    ],
    samples: [clips.trolley, clips.vials, clips.panel, clips.place],
    dataTypes: ["First-person video", "Wrist-camera video", "Action labels", "Hand and object marks"],
    hubCategory: "Video",
  },
];

export function findVertical(slug: string) {
  return verticals.find((item) => item.slug === slug);
}
