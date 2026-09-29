import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { articleSlug } from "@/components/blog/posts";

export function generateStaticParams() {
  return [{ slug: articleSlug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== articleSlug) return { title: "Blog | CNTXT AI" };
  return {
    title: "Five Hundred Licenses | CNTXT AI",
    description:
      "Why enterprise AI stalls after the pilot, and the context layer that makes it compound.",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== articleSlug) notFound();

  return (
    <div>
      <BlogArticle />
    </div>
  );
}
