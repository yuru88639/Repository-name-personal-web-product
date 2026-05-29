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
  country: string | null;
  location_name: string | null;
  map_url: string | null;
  captured_at: string | null;
};

type RecentLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  created_at: string;
};

async function getHomeData() {
  const supabase = await createClient();

  const [essaysResult, galleryResult, recentLinksResult] = await Promise.all([
    supabase
      .from("essays")
      .select("id,title,slug,excerpt,category,language,cover_url,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(12),
    supabase
      .from("gallery_items")
      .select("id,title,subtitle,quote,image_url,target_url,country,location_name,map_url,captured_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("recent_links")
      .select("id,title,url,description,category,created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (essaysResult.error) {
    console.error("Failed to load essays:", essaysResult.error.message);
  }

  if (galleryResult.error) {
    console.error("Failed to load gallery items:", galleryResult.error.message);
  }

  if (recentLinksResult.error) {
    console.error("Failed to load recent links:", recentLinksResult.error.message);
  }

  return {
    essays: (essaysResult.data ?? []) as Essay[],
    galleryItems: (galleryResult.data ?? []) as GalleryItem[],
    recentLinks: (recentLinksResult.data ?? []) as RecentLink[],
  };
}

export default async function HomePage() {
  const { essays, galleryItems, recentLinks } = await getHomeData();

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto grid max-w-[1500px] gap-7 px-5 py-7 lg:grid-cols-[170px_minmax(0,1fr)] lg:px-8">
        <aside className="border-line lg:min-h-[calc(100vh-3.5rem)] lg:border-r lg:pr-7">
          <p className="mb-9 text-xs uppercase tracking-[0.32em] text-muted">COLLECTIONS</p>
          <nav className="grid gap-5 text-sm text-neutral-800">
            <Link className="transition hover:text-clay" href="/">Homepage</Link>
            <Link className="transition hover:text-clay" href="/album">Album</Link>
            <a className="transition hover:text-clay" href="#about">About Me</a>
            <Link className="rounded-card bg-ink px-4 py-3 text-center text-white transition hover:bg-clay" href="/admin">Upload</Link>
          </nav>
          <section className="mt-10 border-t border-line pt-6">
            <Link className="mb-4 block text-xs uppercase tracking-[0.24em] text-muted transition hover:text-clay" href="/links">
              Recent Link
            </Link>
            <div className="grid gap-4">
              {recentLinks.length === 0 ? (
                <p className="text-xs leading-5 text-muted">No links yet.</p>
              ) : (
                recentLinks.map((item) => (
                  <a className="group block" href={item.url} key={item.id} rel="noreferrer" target="_blank">
                    <p className="line-clamp-2 text-xs leading-5 text-neutral-800 group-hover:text-clay">{item.title}</p>
                    {item.category ? <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{item.category}</p> : null}
                  </a>
                ))
              )}
            </div>
          </section>
        </aside>

        <EssayBrowser
          essays={essays}
          rightRail={<ArchivePanel captures={galleryItems} />}
        />
      </div>
    </main>
  );
}
