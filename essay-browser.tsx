"use client";

import { useMemo, useState } from "react";

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
};

export function EssayBrowser({ essays }: EssayBrowserProps) {
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
      <header className="mb-10 border-b border-line pb-8">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted">Aura & Ink</p>
            <h1 className="text-3xl font-normal tracking-normal md:text-5xl">Personal Archive</h1>
          </div>
          <input
            className="h-12 w-full max-w-md rounded-2xl border-0 bg-white px-5 text-sm shadow-soft outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search essays and captures..."
            value={query}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <select
            className="h-11 rounded-card border border-line bg-white px-4 outline-none"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="">全部分类</option>
            <option value="影评">影评</option>
            <option value="社评">社评</option>
            <option value="个人小品">个人小品</option>
            <option value="日记">日记</option>
          </select>
          <input
            className="h-11 rounded-card border border-line bg-white px-4 outline-none"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
          <select
            className="h-11 rounded-card border border-line bg-white px-4 outline-none"
            onChange={(event) => setLanguage(event.target.value)}
            value={language}
          >
            <option value="">全部语言</option>
            <option value="英语">英语</option>
            <option value="德语">德语</option>
            <option value="中文">中文</option>
            <option value="日语">日语</option>
          </select>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {visibleEssays.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-white p-8 text-sm leading-6 text-muted md:col-span-3">
            没有匹配的已发布文章。请调整筛选条件，或到 Upload 后台发布新内容。
          </div>
        ) : (
          visibleEssays.map((essay) => (
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
    </section>
  );
}
