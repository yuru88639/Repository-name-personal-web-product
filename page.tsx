import { ArchivePanel } from "@/components/archive-panel";
import { EssayBrowser, type Essay } from "@/components/essay-browser";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
            <a className="rounded-card bg-ink px-4 py-3 text-center text-white" href="/admin">Upload</a>
          </nav>
        </aside>

        <div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <EssayBrowser essays={essays} />

            <ArchivePanel captures={galleryItems} />
          </div>
        </div>
      </div>
    </main>
  );
}
