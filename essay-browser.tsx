"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

export type Essay = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  language: string;
  cover_url: string | null;
  published_at: string | null;
};

type EssayBrowserProps = {
  essays: Essay[];
  rightRail: ReactNode;
};

export function EssayBrowser({ essays, rightRail }: EssayBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState("");

  const visibleEssays = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return essays.filter((essay) => {
      const text = `${essay.title} ${essay.excerpt ?? ""} ${essay.category} ${essay.language}`.toLowerCase();
      return (
        (!keyword || text.includes(keyword)) &&
        (!category || essay.category === category) &&
        (!language || essay.language === language) &&
        (!date || essay.published_at === date)
      );
    });
  }, [category, date, essays, language, query]);

  return (
    <section>
      <header className="mb-6 border-b border-line pb-5">
        <div className="grid gap-3 2xl:grid-cols-[390px_minmax(420px,1fr)_260px] 2xl:items-center">
          <div className="flex min-w-0 items-baseline gap-4 whitespace-nowrap">
            <p className="shrink-0 text-xs uppercase tracking-[0.22em] text-muted">AURA & INK</p>
            <h1 className="text-3xl font-normal tracking-normal md:text-[38px]">Personal Archive</h1>
          </div>
          <input
            className="h-12 w-full rounded-2xl border border-transparent bg-paper px-6 text-sm shadow-soft outline-none transition focus:border-clay"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search essays and captures..."
            value={query}
          />
          <div className="flex flex-wrap justify-start gap-2 text-[11px] 2xl:justify-end">
            <select
              className="h-8 max-w-24 rounded-card border border-line bg-paper px-2 outline-none transition focus:border-clay"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              <option value="">category</option>
              <option value="影评">影评</option>
              <option value="社评">社评</option>
              <option value="个人小品">个人小品</option>
              <option value="日记">日记</option>
            </select>
            <input
              className="h-8 max-w-28 rounded-card border border-line bg-paper px-2 outline-none transition focus:border-clay"
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
            <select
              className="h-8 max-w-24 rounded-card border border-line bg-paper px-2 outline-none transition focus:border-clay"
              onChange={(event) => setLanguage(event.target.value)}
              value={language}
            >
              <option value="">language</option>
              <option value="英语">英语</option>
              <option value="德语">德语</option>
              <option value="中文">中文</option>
              <option value="日语">日语</option>
            </select>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleEssays.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-paper p-8 text-sm leading-6 text-muted md:col-span-2 2xl:col-span-3">
              没有匹配的已发布文章。请调整筛选条件，或到 Upload 后台发布新内容。
            </div>
          ) : (
            visibleEssays.map((essay) => (
              <Link
                aria-label={`Read ${essay.title}`}
                className="group grid min-h-[390px] rounded-card border border-transparent bg-paper p-4 shadow-soft transition hover:-translate-y-1 hover:border-line hover:shadow-xl"
                href={`/essays/${essay.slug}`}
                key={essay.id}
              >
                <div
                  className="mb-4 h-48 rounded-md bg-[#f6eee2] bg-center bg-no-repeat transition group-hover:opacity-90"
                  style={{
                    backgroundImage: essay.cover_url
                      ? `url(${essay.cover_url})`
                      : "linear-gradient(135deg, #eadfce, #fff8ec)",
                    backgroundSize: essay.cover_url ? "contain" : "cover",
                  }}
                />
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-clay">{essay.category}</p>
                <h2 className="mb-2 line-clamp-3 text-[19px] font-normal leading-tight">{essay.title}</h2>
                <p className="mb-4 line-clamp-2 text-[13px] leading-5 text-neutral-600">{essay.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-4 text-xs text-muted">
                  <span>{essay.published_at ?? "No date"} / {essay.language}</span>
                  <span className="font-medium text-ink">Read →</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {rightRail}
      </div>
    </section>
  );
}
