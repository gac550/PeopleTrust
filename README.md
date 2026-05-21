# PeopleTrust — Landing público

Landing público (SEO + marketing) de PeopleTrust y Argos AaaS.

- **Stack**: Next.js 15 App Router + Tailwind CSS + TypeScript
- **Deploy**: Vercel — `peopletrust.vecttore.com` (temporal) / `peopletrust.cl` (final)
- **Admin app**: `argos.vecttore.com` (Vite SPA, repo separado `gac550/Argos`)
- **Backend**: comparte Supabase con el admin (org ARGOS, ref `tshdsikulhbpusayraof`)

## Páginas

- `/` — Home (hero + agentes + CTA)
- `/precios` — 3 planes (Free / Pro / Enterprise)
- `/contacto` — Form de contacto

## Dev local

```bash
npm install
npm run dev   # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy

Push a `main` → Vercel deploy automático.

## Variables de entorno

`.env.local`:

```
NEXT_PUBLIC_APP_URL=https://argos.vecttore.com
NEXT_PUBLIC_SUPABASE_URL=https://tshdsikulhbpusayraof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from admin .env.local>
```

## SEO

- Metadata API (Next.js 15) configurada en `app/layout.tsx`.
- `sitemap.xml` generado dinámicamente (`app/sitemap.ts`).
- `robots.txt` generado dinámicamente (`app/robots.ts`).
- Open Graph + Twitter cards.
- Lighthouse target: ≥95 mobile.

## Decisiones arquitectónicas

Ver `docs/plans/2026-05-21 23.00.00 Landing Next.js MVP.md` en el repo principal `gac550/Argos`.
