"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type UserState = {
  id: string;
  email?: string;
};

const categories = ["影评", "社评", "个人小品", "日记"];
const languages = ["英语", "德语", "中文", "日语"];

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

export function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<UserState | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? undefined });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? undefined } : null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function sendLoginLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    setBusy(false);
    setMessage(error ? error.message : "登录链接已发送，请去邮箱点击确认。");
  }

  async function uploadFile(file: File | null, folder: string) {
    if (!file || file.size === 0 || !user) return null;

    const path = `${user.id}/${folder}/${Date.now()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file);

    if (error) throw error;

    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  }

  async function ensureProfile() {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: user.email ?? "Admin",
    });

    if (error) throw error;
  }

  async function publishEssay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await ensureProfile();
      const title = String(form.get("title") ?? "");
      const coverUrl = await uploadFile(form.get("cover") as File | null, "covers");
      const { error } = await supabase.from("essays").insert({
        author_id: user.id,
        title,
        slug: makeSlug(String(form.get("slug") || title)),
        excerpt: String(form.get("excerpt") ?? ""),
        content: String(form.get("content") ?? ""),
        category: String(form.get("category") ?? "个人小品"),
        language: String(form.get("language") ?? "中文"),
        cover_url: coverUrl,
        published_at: String(form.get("published_at") ?? ""),
        is_published: true,
      });

      if (error) throw error;
      event.currentTarget.reset();
      setMessage("文章已发布。回到首页刷新即可看到。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "发布文章失败。");
    } finally {
      setBusy(false);
    }
  }

  async function publishGalleryItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await ensureProfile();
      const imageUrl = await uploadFile(form.get("image") as File | null, "gallery");
      const { error } = await supabase.from("gallery_items").insert({
        owner_id: user.id,
        title: String(form.get("title") ?? ""),
        subtitle: String(form.get("subtitle") ?? ""),
        quote: String(form.get("quote") ?? ""),
        image_url: imageUrl,
        target_url: String(form.get("target_url") ?? "#"),
        sort_order: Number(form.get("sort_order") || 100),
        is_active: true,
      });

      if (error) throw error;
      event.currentTarget.reset();
      setMessage("相册内容已发布。回到首页刷新即可看到。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "发布相册失败。");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <section className="mx-auto max-w-lg rounded-card bg-white p-8 shadow-soft">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Upload Portal</p>
          <h1 className="mb-6 text-3xl font-normal">登录后发布内容</h1>
          <form className="grid gap-4" onSubmit={sendLoginLink}>
            <input
              className="h-12 rounded-card border border-line px-4 outline-none"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="你的邮箱"
              required
              type="email"
              value={email}
            />
            <button className="h-12 rounded-card bg-ink text-white" disabled={busy}>
              {busy ? "发送中..." : "发送登录链接"}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Upload Portal</p>
            <h1 className="text-4xl font-normal">发布文章与相册</h1>
            <p className="mt-3 text-sm text-muted">{user.email}</p>
          </div>
          <button
            className="h-11 rounded-card border border-line bg-white px-5 text-sm"
            onClick={() => supabase.auth.signOut()}
          >
            退出登录
          </button>
        </header>

        {message ? <p className="mb-6 rounded-card bg-white p-4 text-sm text-muted shadow-soft">{message}</p> : null}

        <div className="grid gap-8 lg:grid-cols-2">
          <form className="grid gap-4 rounded-card bg-white p-6 shadow-soft" onSubmit={publishEssay}>
            <h2 className="text-2xl font-normal">发布文章</h2>
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="title" placeholder="标题" required />
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="slug" placeholder="URL 名称，例如 my-first-essay" />
            <textarea className="min-h-20 rounded-card border border-line p-4 outline-none" name="excerpt" placeholder="摘要" />
            <textarea className="min-h-40 rounded-card border border-line p-4 outline-none" name="content" placeholder="正文" />
            <div className="grid gap-3 md:grid-cols-3">
              <select className="h-11 rounded-card border border-line px-4 outline-none" name="category">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select className="h-11 rounded-card border border-line px-4 outline-none" name="language">
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input className="h-11 rounded-card border border-line px-4 outline-none" name="published_at" required type="date" />
            </div>
            <label className="grid gap-2 text-sm text-muted">
              封面图
              <input accept="image/*" name="cover" type="file" />
            </label>
            <button className="h-12 rounded-card bg-ink text-white" disabled={busy}>
              {busy ? "发布中..." : "发布文章"}
            </button>
          </form>

          <form className="grid gap-4 rounded-card bg-white p-6 shadow-soft" onSubmit={publishGalleryItem}>
            <h2 className="text-2xl font-normal">发布相册</h2>
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="title" placeholder="标题" required />
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="subtitle" placeholder="地点/时间" />
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="quote" placeholder="短句" />
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="target_url" placeholder="跳转链接，可留空" />
            <input className="h-11 rounded-card border border-line px-4 outline-none" name="sort_order" placeholder="排序，例如 10" type="number" />
            <label className="grid gap-2 text-sm text-muted">
              相册图片
              <input accept="image/*" name="image" required type="file" />
            </label>
            <button className="h-12 rounded-card bg-ink text-white" disabled={busy}>
              {busy ? "发布中..." : "发布相册"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
