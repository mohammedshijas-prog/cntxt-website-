import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: "CNTXT AI captures and verifies data from real work, trains models on it and deploys AI on-premise for enterprises and governments.",
};

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
