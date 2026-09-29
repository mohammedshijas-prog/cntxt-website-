import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "CNTXT AI",
  description: "The world’s most important decisions need real-world AI.",
};

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
