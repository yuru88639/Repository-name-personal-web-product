/* eslint-disable @next/next/no-html-link-for-pages */
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RecentLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  created_at: string;
};

export default async function LinksPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recent_links")
    .select("id,title,url,description,category,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const links = (data ?? []) as RecentLink[];

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <section className="mx-auto max-w-4xl">
        <a className="mb-10 inline-block text-sm text-muted transition hover:text-clay" href="/">← Back to archive</a>
        <header className="mb-8 border-b border-line pb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted">Collections</p>
          <h1 className="text-5xl font-normal">Recent Link</h1>
        </header>
        <div className="grid gap-4">
          {links.map((item) => (
            <a className="rounded-card bg-paper p-5 shadow-soft transition hover:-translate-y-1" href={item.url} key={item.id} rel="noreferrer" target="_blank">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-clay">{item.category ?? "Link"}</p>
              <h2 className="text-2xl font-normal">{item.title}</h2>
              {item.description ? <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p> : null}
              <p className="mt-4 break-all text-xs text-muted">{item.url}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
