import { ArchivePanel } from "@/components/archive-panel";
import { EssayBrowser, type Essay } from "@/components/essay-browser";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
      .limit(12),
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
      <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-7 lg:grid-cols-[150px_minmax(0,1fr)] lg:px-8">
        <aside className="border-line lg:min-h-[calc(100vh-3.5rem)] lg:border-r lg:pr-7">
          <p className="mb-9 text-xs uppercase tracking-[0.32em] text-muted">COLLECTIONS</p>
          <nav className="grid gap-5 text-sm text-neutral-800">
            <Link className="transition hover:text-clay" href="/">Homepage</Link>
            <a className="transition hover:text-clay" href="#about">About Me</a>
            <Link className="rounded-card bg-ink px-4 py-3 text-center text-white transition hover:bg-clay" href="/admin">Upload</Link>
          </nav>
        </aside>

        <EssayBrowser
          essays={essays}
          rightRail={<ArchivePanel captures={galleryItems} recentLinks={essays.slice(0, 4)} />}
        />
      </div>
    </main>
  );
}
