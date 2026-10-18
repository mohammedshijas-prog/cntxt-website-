import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { article, articleSlug } from "@/components/blog/posts";
import { PostArticle } from "@/components/blog/PostArticle";
import { publishedPost } from "@/lib/supabase/server";

export const revalidate = 60;
// Portal posts are rendered on first request, then cached.
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ slug: articleSlug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== articleSlug) {
    const post = await publishedPost(slug);
    if (!post) return { title: "Blog" };
    return {
      title: post.title,
      alternates: { canonical: `/blog/${post.slug}` },
      description: post.excerpt,
      openGraph: post.cover_url ? { images: [post.cover_url] } : undefined,
    };
  }
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
  if (slug !== articleSlug) {
    const post = await publishedPost(slug);
    if (!post) notFound();
    return <PostArticle post={post} />;
  }

  return (
    <div>
      <BlogArticle />
    </div>
  );
}
