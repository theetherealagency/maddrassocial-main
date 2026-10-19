# Madras Social

Website for Madras Social, a South Indian kitchen and bar at 8 Erb Street
West, Waterloo. Structural clone of the Madras Mami site — see `CLAUDE.md`
for the rules and `BUILD-PLAN.md` for the plan.

## Stack

Vite + React 18 SPA, react-router-dom, shadcn/ui, Tailwind, Supabase, Vercel.

## Develop

```sh
npm ci
cp .env.example .env.local   # optional — every key has a fallback
npm run dev
```

## Build

```sh
npm run build
```

`vite build`, then `scripts/build-seo.mjs` pre-renders static HTML per route
from `seo/`, then `scripts/copy-subsites.mjs` copies `hiring/` and `rsvp/`
into `dist/_sites/`. `vercel.json` rewrites each route to its page and
`middleware.js` serves the subsites on their own hosts.

## Where things live

- Business data — `seo/site.mjs`, `seo/routes.mjs`, `seo/schema.mjs`
- Known-missing values — `PENDING.md`
- Environment variables — `.env.example`
