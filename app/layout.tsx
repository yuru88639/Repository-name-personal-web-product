import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Web Product",
  description: "A personal web product built with Next.js, Tailwind CSS, Supabase, and Vercel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
