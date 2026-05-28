# Personal Web Product

Next.js App Router + Tailwind CSS + Supabase + Vercel starter structure.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase project URL and anon key to `.env.local`.

4. Start the dev server:

```bash
npm run dev
```

## Structure

- `app/` - Next.js App Router pages and layouts.
- `components/` - Reusable UI components.
- `lib/supabase/` - Supabase browser and server clients.
- `public/` - Static assets for deployment.
