import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About | CNTXT AI",
  description:
    "Real-world AI is lacking context. That’s why we created cntxt.",
};

export default function About() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
