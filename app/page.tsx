import { ArchivePanel } from "@/components/archive-panel";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Essay = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  language: string;
  cover_url: string | null;
  published_at: string | null;
};

type GalleryItem = {
  id: string;
  title: string;
  subtitle: string | null;
  quote: string | null;
  image_url: string | null;
  target_url: string | null;
};

async function getHomeData() {
  const supabase = await createClient();

  const [essaysResult, galleryResult] = await Promise.all([
    supabase
      .from("essays")
      .select("id,title,slug,excerpt,category,language,cover_url,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(9),
    supabase
      .from("gallery_items")
      .select("id,title,subtitle,quote,image_url,target_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(8),
  ]);

  if (essaysResult.error) {
    console.error("Failed to load essays:", essaysResult.error.message);
  }

  if (galleryResult.error) {
    console.error("Failed to load gallery items:", galleryResult.error.message);
  }

  return {
    essays: (essaysResult.data ?? []) as Essay[],
    galleryItems: (galleryResult.data ?? []) as GalleryItem[],
  };
}

export default async function HomePage() {
  const { essays, galleryItems } = await getHomeData();

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="border-line lg:min-h-[calc(100vh-4rem)] lg:border-r lg:pr-8">
          <p className="mb-8 text-xs uppercase tracking-[0.22em] text-muted">Collections</p>
          <nav className="grid gap-4 text-sm text-neutral-700">
            <a href="#">The Minimalist</a>
            <a href="#">Bauhaus Archive</a>
            <a href="#">Design Anthology</a>
            <a href="#">Resume</a>
          </nav>
        </aside>

        <section>
          <header className="mb-10 flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted">Aura & Ink</p>
              <h1 className="text-3xl font-normal tracking-normal md:text-5xl">Personal Archive</h1>
            </div>
            <input
              className="h-12 w-full max-w-md rounded-2xl border-0 bg-white px-5 text-sm shadow-soft outline-none"
              placeholder="Search essays and captures..."
            />
          </header>

          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            <div className="grid gap-6 md:grid-cols-3">
              {essays.length === 0 ? (
                <div className="rounded-card border border-dashed border-line bg-white p-8 text-sm leading-6 text-muted md:col-span-3">
                  还没有已发布文章。请在 Supabase 的 essays 表里新增内容，并把 is_published 设为 true。
                </div>
              ) : (
                essays.map((essay) => (
                <article key={essay.id} className="rounded-card bg-white p-6 shadow-soft">
                  <div
                    className="mb-6 aspect-square rounded-md bg-cover bg-center"
                    style={{
                      backgroundImage: essay.cover_url
                        ? `url(${essay.cover_url})`
                        : "linear-gradient(135deg, #e5e7eb, #f8fafc)",
                    }}
                  />
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-amber-800">{essay.category}</p>
                  <h2 className="mb-3 text-2xl font-normal leading-tight">{essay.title}</h2>
                  <p className="mb-5 text-sm leading-6 text-neutral-600">{essay.excerpt}</p>
                  <p className="text-xs text-muted">
                    {essay.published_at ?? "No date"} / {essay.language}
                  </p>
                </article>
                ))
              )}
            </div>

            <ArchivePanel captures={galleryItems} />
          </div>
        </section>
      </div>
    </main>
  );
}
