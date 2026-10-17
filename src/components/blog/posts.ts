export const articleSlug = "why-arabic-voice-ai-needs-25-dialects-not-one";

export const categories = [
  "All",
  "Arabic AI",
  "Data",
  "Evaluation",
  "Agents",
  "Industry",
] as const;

export type Category = (typeof categories)[number];

const insightHub = "https://www.cntxt.tech/insight-hub";

export const featured = {
  slug: articleSlug,
  chip: "Arabic AI" as Category,
  kicker: "arabic ai",
  title: ["Why Arabic voice AI needs", "25 dialects, not one."],
  blurb:
    "People do not speak the Arabic that most speech models were trained on. How Munsit was trained on real-world audio across more than 25 dialects, and why that decides whether a transcript can be used.",
  meta: "CNTXT AI · 4 min read",
  image: "/art/cover-1.svg",
};

const covers = Array.from({ length: 12 }, (_, i) => `/art/cover-${i + 2}.svg`);

// Articles published on cntxt.tech/insight-hub. Cards link out to the original.
const insights: { chip: Category; title: string; blurb: string; path: string }[] = [
  {
    chip: "Arabic AI",
    title: "The Arabic AI performance gap: why global models fail in MEA",
    blurb:
      "Models trained mostly on English serve Arabic-speaking markets poorly. A look at where they fall short and what Arabic-native systems do differently.",
    path: "the-arabic-ai-performance-gap-why-global-models-fail-in-mea",
  },
  {
    chip: "Arabic AI",
    title: "Data scarcity drives the Arabic AI gap",
    blurb:
      "Arabic is not harder for AI than English. There is far less Arabic training data, and closing the gap starts with collecting and annotating more of it.",
    path: "data-scarcity-drives-arabic-ai-gap",
  },
  {
    chip: "Arabic AI",
    title:
      "Advancing Arabic speech recognition through large-scale weakly supervised learning",
    blurb:
      "The research behind Munsit: training Arabic speech recognition on large volumes of real-world audio with weak supervision.",
    path: "advancing-arabic-speech-recognition-through-large-scale-weakly-supervised-learning",
  },
  {
    chip: "Arabic AI",
    title: "Munsit at NADI 2025: pushing the boundaries of multidialectal Arabic ASR",
    blurb:
      "Munsit's entry to the NADI 2025 shared task on speech recognition across Arabic dialects.",
    path: "munsit-at-nadi-2025-shared-task-2-pushing-the-boundaries-of-multidialectal-arabic-asr",
  },
  {
    chip: "Data",
    title: "Human in the loop: data quality with human and machine collaboration",
    blurb:
      "Machines handle the routine labelling. People handle the edge cases. How splitting the work that way produces data a model can be trained on.",
    path: "human-in-the-loop-data-quality-with-human-and-machine-collaboration",
  },
  {
    chip: "Data",
    title: "Minimizing AI hallucinations: the role of high-quality training data",
    blurb:
      "Models that state false information as fact are a business risk. Better data preparation, retrieval and human feedback reduce it.",
    path: "minimizing-ai-hallucinations-the-role-of-high-quality-training-data-in-model-reliability",
  },
  {
    chip: "Data",
    title: "Video analysis at scale: insights from frame-by-frame annotation",
    blurb:
      "How video footage becomes structured, machine-readable data through frame-by-frame annotation, and what it demands in volume and compute.",
    path: "video-analysis-at-scale-insights-from-frame-by-frame-annotation",
  },
  {
    chip: "Evaluation",
    title: "6 steps to build a strong AI testing and validation framework",
    blurb:
      "AI systems need validation throughout their life, not one test before launch. Six steps from setting objectives to monitoring and governance.",
    path: "6-steps-to-build-a-strong-ai-testing-and-validation-framework-",
  },
  {
    chip: "Evaluation",
    title: "Evaluation of RAGs using RAGAS",
    blurb:
      "Using the open-source RAGAS framework to find out whether a retrieval-augmented system fails at retrieval or at generation.",
    path: "evaluation-of-rags-using-ragas",
  },
  {
    chip: "Agents",
    title: "AI agents vs AI assistants: what's the difference?",
    blurb:
      "Assistants respond when a person asks. Agents pursue a goal on their own. What separates the two and when each one fits.",
    path: "ai-agents-vs-ai-assistants-whats-the-difference",
  },
  {
    chip: "Industry",
    title: "8 things to consider when introducing AI in healthcare",
    blurb:
      "Eight considerations for healthcare teams adopting AI, from regulatory compliance and data quality to privacy, bias and workflow integration.",
    path: "8-things-to-consider-when-introducing-ai-in-healthcare",
  },
  {
    chip: "Industry",
    title: "4 key applications of AI in modern banking",
    blurb:
      "Where banks apply AI: risk and fraud detection, customer experience, operations and process automation, and regulatory compliance.",
    path: "4-key-applications-of-ai-in-modern-banking",
  },
];

export const cards = insights.map((insight, index) => ({
  id: `card-${index + 1}`,
  href: `${insightHub}/${insight.path}`,
  kicker: "insight hub",
  title: insight.title,
  blurb: insight.blurb,
  meta: insight.chip,
  chip: insight.chip,
  image: covers[index % covers.length],
}));

export const article = {
  kicker: "arabic ai",
  title: ["Why Arabic voice AI needs", "25 dialects, not one."],
  meta: "CNTXT AI · 4 min read",
  description:
    "People do not speak the Arabic most speech models were trained on. How Munsit was trained on real-world audio across more than 25 dialects.",
  paragraphs: [
    "Ask a speech model to transcribe a news bulletin in Modern Standard Arabic and it will usually do well. Ask the same model to transcribe a customer calling a bank in Riyadh, a nurse handing over a shift in Cairo or a team meeting in Abu Dhabi, and the transcript starts to fall apart. The words are Arabic. They are not the Arabic the model learned.",
    "Modern Standard Arabic is the language of news, books and formal speeches. It is not what people speak at home, at work or on the phone. Everyday Arabic is a family of dialects that differ in vocabulary, pronunciation and grammar from one country to the next, and often from one city to the next. A model trained on one variety treats the others as noise. For an organisation, that means call recordings nobody can search, meeting notes that need rewriting by hand, and voice agents that ask customers to repeat themselves.",
    "The cause is data, not the language. Arabic is no harder for a machine to learn than English. There is simply far less recorded, transcribed Arabic to learn from, and most of what exists is formal speech. Models built for global markets are trained mostly on English and treat Arabic as one language with one sound. The gap shows up the moment a real person starts talking.",
    "Speech has a second complication. Arabic speakers in the workplace move between Arabic and English inside a single sentence, usually for a product name, a technical term or a number. A system that handles only one language at a time drops or mangles exactly those words, and they tend to be the ones that matter most in the transcript.",
  ],
  subhead: "How Munsit was trained on the Arabic people speak",
  more: [
    "Munsit, CNTXT AI's Arabic voice platform, starts from the other end. Its speech-to-text model was trained from more than 30,000 hours of real-world Arabic audio, covering more than 25 dialects. Collecting audio at that scale is the easier half of the job. Transcribing that much audio by hand is slow and costly, so the team used weak supervision: the model learns from large volumes of audio whose labels are imperfect, and a filtering step keeps only the recordings whose labels can be trusted. That filtering reduced the 30,000 hours to a 15,000-hour high-quality set, which was used to train a Conformer model.",
    "The result is measured in public. Munsit ranks first on the Hugging Face Open Universal Arabic ASR Leaderboard and records the lowest word error rate on six independent Arabic benchmarks. Because it was trained on speech as it is spoken, it also handles Arabic–English code-switching, so a sentence that changes language halfway comes out as one coherent line of text. On top of the transcript it adds speaker diarisation, word-level timestamps, translation and meeting minutes.",
    "Accuracy is only useful if the model can run where the audio is allowed to go. Recordings of citizens, patients and customers often cannot leave the country, and sometimes cannot leave the building. Munsit deploys through an API, on-premises, in a sovereign cloud or on the device itself, so the organisation decides where its audio is processed and keeps control of it.",
    "The lesson reaches beyond speech. A model is as good as the data it was trained on, and data that reflects how people really talk has to be collected from real life and checked before it is used. Twenty-five dialects is not a feature added at the end. It is what the training data has to look like if the model is going to work for the people who use it.",
  ],
  topics: [
    "Arabic speech recognition",
    "Dialects",
    "Training data",
    "Code-switching",
    "On-premises deployment",
  ],
};

export const readNext = [
  {
    image: "/art/cover-4.svg",
    under: "/art/cover-9.svg",
    title:
      "Advancing Arabic speech recognition through large-scale weakly supervised learning",
    category: "Arabic AI" as Category,
    href: `${insightHub}/advancing-arabic-speech-recognition-through-large-scale-weakly-supervised-learning`,
  },
  {
    image: "/art/cover-5.svg",
    under: "/art/cover-10.svg",
    title: "Munsit at NADI 2025: pushing the boundaries of multidialectal Arabic ASR",
    category: "Arabic AI" as Category,
    href: `${insightHub}/munsit-at-nadi-2025-shared-task-2-pushing-the-boundaries-of-multidialectal-arabic-asr`,
  },
  {
    image: "/art/cover-3.svg",
    under: "/art/cover-11.svg",
    title: "Data scarcity drives the Arabic AI gap",
    category: "Arabic AI" as Category,
    href: `${insightHub}/data-scarcity-drives-arabic-ai-gap`,
  },
];
