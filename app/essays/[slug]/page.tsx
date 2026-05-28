import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EssayDetail = {
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  language: string;
  cover_url: string | null;
  published_at: string | null;
};

type EssayPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("essays")
    .select("title,excerpt,content,category,language,cover_url,published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    notFound();
  }

  const essay = data as EssayDetail;
  const paragraphs = (essay.content || essay.excerpt || "")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <article className="mx-auto max-w-3xl">
        <Link className="mb-10 inline-block text-sm text-muted" href="/">
          ← Back to archive
        </Link>

        <header className="mb-10 border-b border-line pb-8">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-amber-800">
            {essay.category}
          </p>
          <h1 className="text-4xl font-normal leading-tight md:text-6xl">
            {essay.title}
          </h1>
          <p className="mt-5 text-sm text-muted">
            {essay.published_at ?? "No date"} / {essay.language}
          </p>
          {essay.excerpt ? (
            <p className="mt-6 text-xl leading-8 text-neutral-600">
              {essay.excerpt}
            </p>
          ) : null}
        </header>

        {essay.cover_url ? (
          <div
            className="mb-10 aspect-[16/10] rounded-card bg-cover bg-center shadow-soft"
            style={{ backgroundImage: `url(${essay.cover_url})` }}
          />
        ) : null}

        <div className="grid gap-6 text-lg leading-9 text-neutral-800">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))
          ) : (
            <p>这篇文章还没有正文内容。</p>
          )}
        </div>
      </article>
    </main>
  );
}
