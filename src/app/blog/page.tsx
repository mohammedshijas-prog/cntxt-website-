import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Research notes and practical guides from CNTXT AI on Arabic AI, training data, evaluation and putting AI to work in regulated industries.",
};

export default function BlogPage() {
  return (
    <div>
      <BlogIndex />
    </div>
  );
}
