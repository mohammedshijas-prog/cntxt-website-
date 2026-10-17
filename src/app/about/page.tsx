import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "CNTXT AI is an Abu Dhabi data and AI company founded by Mohammad and Hassan Abu Sheikh. We capture and verify real-world data, train models and deploy AI on-premise.",
};

export default function About() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
