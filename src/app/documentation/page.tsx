import { Source_Code_Pro } from "next/font/google";
import type { Metadata } from "next";
import { DocsPage } from "@/components/documentation/DocsPage";

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "Documentation",
  alternates: { canonical: "/documentation" },
  description:
    "Integrate Munsit Arabic speech-to-text and text-to-speech: API keys, REST and streaming endpoints, voice-agent integrations and on-premises deployment.",
};

export default function Documentation() {
  return (
    <div className={sourceCode.variable}>
      <DocsPage />
    </div>
  );
}
