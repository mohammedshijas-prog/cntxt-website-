import { Source_Code_Pro } from "next/font/google";
import type { Metadata } from "next";
import { DocsPage } from "@/components/documentation/DocsPage";

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "Documentation | CNTXT AI",
  description:
    "Customizations for setting the width and height of an element at the same time.",
};

export default function Documentation() {
  return (
    <div className={sourceCode.variable}>
      <DocsPage />
    </div>
  );
}
