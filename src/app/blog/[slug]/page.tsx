import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { article, articleSlug } from "@/components/blog/posts";

export function generateStaticParams() {
  return [{ slug: articleSlug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== articleSlug) return { title: "Blog" };
  return {
    title: "Why Arabic voice AI needs 25 dialects, not one",
    alternates: { canonical: `/blog/${articleSlug}` },
    description: article.description,
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
