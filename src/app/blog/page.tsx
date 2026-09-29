import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | CNTXT AI",
  description:
    "Product updates, engineering deep-dives, and how teams are turning their context into software that runs itself.",
};

export default function BlogPage() {
  return (
    <div>
      <BlogIndex />
    </div>
  );
}
