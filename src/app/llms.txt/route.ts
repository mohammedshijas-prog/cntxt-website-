/*
 * llms.txt (llmstxt.org): a plain summary for AI assistants and answer engines,
 * so they describe CNTXT accurately. Facts restate docs/content-brief.md only.
 */
const body = `# CNTXT AI

> CNTXT AI is a UAE-based data and AI company headquartered in Abu Dhabi. It captures and verifies data from real work, trains models on it, and deploys Arabic-first AI on-premises, hybrid or in the cloud for enterprises and governments.

Key facts:
- Founded by Mohammad Abu Sheikh (Co-Founder & CEO) and Hassan Abu Sheikh (Co-Founder).
- Raised a $60M Series A in June 2026, co-led by AI71 and BlueFive Capital.
- 250+ enterprise and government organisations served; 30M+ data points annotated.
- Data labelling at 98% accuracy with human-in-the-loop quality checks; native Arabic annotators across 25+ dialects.
- Holds SOC 2 Type II and ISO 27001; GDPR and HIPAA are listed in the trust centre (https://cntxt.trust.site).
- Technology partners: Oracle, NVIDIA (Inception member), AWS. Research and ecosystem partners: TII, AI71, Beam, Middlesex University Dubai.

## Products
- [Munsit](https://munsit.com): Arabic speech-to-text and text-to-speech across 25+ dialects; #1 on the Hugging Face Open Universal Arabic ASR Leaderboard.
- [Agentix](https://www.cntxt.tech/agentix): Arabic voice and chat agents with GCC telephony that answer customers in their dialect and complete the task.
- [KLKT](https://klkt.app): an app where people record everyday work with consent and are paid per accepted hour; 67,795+ people in more than 20 countries.

## Services
- [Data-as-a-service](https://www.cntxt.tech/data-services): data collection, annotation of audio, text, image, video, LiDAR and documents, expert AI evaluation, and physical-AI data.
- [Physical AI data](https://www.cntxt.tech/physical-ai): first-person video of real work for robotics and embodied AI; 1.8 million annotated frames in six months for a GCC robotics lab.
- [Data catalogue](https://www.cntxt.tech/data-hub): ready-made data categories by modality, requested in one list.
- [Custom AI solutions](https://www.cntxt.tech/solutions): AI built on an organisation's own data and deployed on its infrastructure.
- [AI Lab overview](https://www.cntxt.tech/products): data, models and agents in one stack.

## Industries
- [Financial services](https://www.cntxt.tech/industries/financial-services): judicial claims processing with 83% less processing time and 64% less legal workload.
- [Public sector](https://www.cntxt.tech/industries/public-sector): a data platform unifying 30 sub-entities, 100% on-premises.
- [Healthcare](https://www.cntxt.tech/healthcare)
- [Real estate](https://www.cntxt.tech/industries/real-estate)
- [Insurance](https://www.cntxt.tech/industries/insurance)

## Company
- [About](https://www.cntxt.tech/about)
- [Security](https://www.cntxt.tech/security)
- [Partners](https://www.cntxt.tech/partners)
- [Careers](https://www.cntxt.tech/careers)
- [Blog](https://www.cntxt.tech/blog)
- [Contact](https://www.cntxt.tech/contact): sales@cntxt.tech
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
