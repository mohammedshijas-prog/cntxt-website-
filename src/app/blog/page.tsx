import type { Metadata } from "next";
import { BlogIndex, type BlogCard } from "@/components/blog/BlogIndex";
import { publishedPosts } from "@/lib/supabase/server";

// Posts published in the portal show up within a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Research notes and practical guides from CNTXT AI on Arabic AI, training data, evaluation and putting AI to work in regulated industries.",
};

export default async function BlogPage() {
  const posts = await publishedPosts();
  const published: BlogCard[] = posts.map((post) => ({
    id: post.id,
    href: `/blog/${post.slug}`,
    kicker: post.category.toLowerCase(),
    title: post.title,
    blurb: post.excerpt,
    meta: post.author,
    chip: post.category as BlogCard["chip"],
    image: post.cover_url ?? "/brand/product/label-video.webp",
    internal: true,
  }));
  return (
    <div>
      <BlogIndex published={published} />
    </div>
  );
}
