"use client";

import { useState } from "react";

export type Capture = {
  id: string;
  title: string;
  subtitle: string | null;
  quote: string | null;
  image_url: string | null;
  target_url: string | null;
};

type ArchivePanelProps = {
  captures: Capture[];
};

const fallbackCaptures: Capture[] = [
  {
    id: "fallback-1",
    title: "Visual Diary",
    subtitle: "Waiting for your first capture",
    quote: "Upload a gallery item in Supabase to replace this card.",
    image_url: null,
    target_url: null,
  },
];

export function ArchivePanel({ captures }: ArchivePanelProps) {
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

  return (
    <aside className="relative">
      <div className="absolute inset-x-5 top-6 h-full rotate-2 rounded-card bg-white shadow-soft" />
      <div className="absolute inset-x-3 top-3 h-full -rotate-2 rounded-card bg-white shadow-soft" />
      <section className="relative overflow-hidden rounded-card bg-white shadow-soft">
        <div className="flex items-center justify-between p-7">
          <h2 className="text-3xl font-normal">Visual Diary</h2>
          <div className="flex gap-3">
            <button className="grid size-12 place-items-center rounded-2xl border border-line" onClick={showPrevious}>
              <span aria-hidden>‹</span>
              <span className="sr-only">Previous capture</span>
            </button>
            <button className="grid size-12 place-items-center rounded-2xl border border-line" onClick={showNext}>
              <span aria-hidden>›</span>
              <span className="sr-only">Next capture</span>
            </button>
          </div>
        </div>

        <a
          className="flex min-h-[420px] items-end bg-cover bg-center p-9 text-white"
          href={capture.target_url ?? "#"}
          style={imageStyle}
        >
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.36em]">Vol. II / Capture #{142 + active}</p>
            <h3 className="mb-3 max-w-64 text-3xl font-normal leading-tight">{capture.title}</h3>
            <p className="text-sm text-white/75">{capture.subtitle}</p>
          </div>
        </a>

        <div className="flex min-h-24 items-center justify-between gap-5 px-9 py-6">
          <p className="italic text-neutral-700">&quot;{capture.quote}&quot;</p>
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
    </aside>
  );
}
