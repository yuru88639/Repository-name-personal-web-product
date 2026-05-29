import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AlbumItem = {
  id: string;
  title: string;
  image_url: string | null;
  country: string | null;
  location_name: string | null;
  captured_at: string | null;
  map_url: string | null;
  target_url: string | null;
};

export default async function AlbumPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("id,title,image_url,country,location_name,captured_at,map_url,target_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as AlbumItem[];

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <section className="mx-auto max-w-6xl">
        <Link className="mb-10 inline-block text-sm text-muted" href="/">← Back to archive</Link>
        <header className="mb-8 border-b border-line pb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted">Collections</p>
          <h1 className="text-5xl font-normal">Album</h1>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const mapHref = item.map_url || item.target_url;
            const location = [item.country, item.location_name].filter(Boolean).join(" / ");
            return (
              <a
                className="rounded-card bg-paper p-4 shadow-soft transition hover:-translate-y-1"
                href={mapHref ?? "#"}
                key={item.id}
                rel="noreferrer"
                target={mapHref ? "_blank" : undefined}
              >
                <div className="mb-4 flex h-72 items-center justify-center rounded-md bg-[#17120e]">
                  {item.image_url ? <img alt={item.title} className="max-h-full max-w-full object-contain" src={item.image_url} /> : null}
                </div>
                <h2 className="text-xl font-normal">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.captured_at ?? "No date"} {location ? `/ ${location}` : ""}</p>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
