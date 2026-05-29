"use client";

import { useState } from "react";
import Link from "next/link";

export type Capture = {
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
  slug: string;
  published_at: string | null;
  category: string;
};

type ArchivePanelProps = {
  captures: Capture[];
  recentLinks: RecentLink[];
};

const fallbackCaptures: Capture[] = [
  {
    id: "fallback-1",
    title: "Visual Diary",
    subtitle: "Waiting for your first capture",
    quote: "Upload a gallery item in Supabase to replace this card.",
    image_url: null,
    target_url: null,
    country: null,
    location_name: null,
    map_url: null,
    captured_at: null,
  },
];

export function ArchivePanel({ captures, recentLinks }: ArchivePanelProps) {
  const items = captures.length > 0 ? captures : fallbackCaptures;
  const [active, setActive] = useState(0);
  const capture = items[active] ?? items[0];

  function showNext() {
    setActive((index) => (index + 1) % items.length);
  }

  function showPrevious() {
    setActive((index) => (index - 1 + items.length) % items.length);
  }

  const imageStyle = capture.image_url
    ? { backgroundImage: `linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.58)), url(${capture.image_url})` }
    : {
        backgroundImage:
          "linear-gradient(135deg, #083344 0%, #64748b 48%, #111827 100%)",
      };
  const locationLabel = [capture.country, capture.location_name || capture.subtitle].filter(Boolean).join(" / ");
  const mapHref = capture.map_url || capture.target_url;
  const hasQuote = Boolean(capture.quote?.trim());

  return (
    <aside className="grid gap-5">
      <section className="relative overflow-hidden rounded-card bg-paper shadow-soft">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-normal">Visual Diary</h2>
          <div className="flex gap-3">
            <button className="grid size-10 place-items-center rounded-2xl border border-line bg-paper transition hover:border-clay" onClick={showPrevious}>
              <span aria-hidden>‹</span>
              <span className="sr-only">Previous capture</span>
            </button>
            <button className="grid size-10 place-items-center rounded-2xl border border-line bg-paper transition hover:border-clay" onClick={showNext}>
              <span aria-hidden>›</span>
              <span className="sr-only">Next capture</span>
            </button>
          </div>
        </div>

        <a
          className="flex min-h-[320px] items-end bg-cover bg-center p-6 text-white"
          href={mapHref ?? "#"}
          style={imageStyle}
        >
          <div>
            <h3 className="mb-3 max-w-72 text-2xl font-normal leading-tight">{capture.title}</h3>
            {capture.captured_at ? (
              <p className="text-xs uppercase tracking-[0.18em] text-white/80">{capture.captured_at}</p>
            ) : null}
            {locationLabel ? <p className="mt-2 text-sm text-white/85">{locationLabel}</p> : null}
            {mapHref ? (
              <span className="mt-4 inline-block rounded-full border border-white/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/85">
                Open map
              </span>
            ) : null}
          </div>
        </a>

        <div className="flex min-h-16 items-center justify-between gap-5 px-6 py-4">
          <p className="italic text-neutral-700">{hasQuote ? `“${capture.quote}”` : ""}</p>
          <div className="flex gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={`size-2 rounded-full ${index === active ? "bg-ink" : "bg-neutral-200"}`}
                onClick={() => setActive(index)}
              >
                <span className="sr-only">Show {item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-card bg-paper p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-normal">Recent Link</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Latest</span>
        </div>
        <div className="grid gap-4">
          {recentLinks.length === 0 ? (
            <p className="text-sm leading-6 text-muted">No published links yet.</p>
          ) : (
            recentLinks.map((item) => (
              <Link
                className="border-t border-line pt-4 transition first:border-t-0 first:pt-0 hover:text-clay"
                href={`/essays/${item.slug}`}
                key={item.id}
              >
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-clay">{item.category}</p>
                <h3 className="line-clamp-2 text-sm font-normal leading-5">{item.title}</h3>
                <p className="mt-2 text-xs text-muted">{item.published_at ?? "No date"}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}
