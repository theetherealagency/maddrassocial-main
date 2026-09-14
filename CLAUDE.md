# Madras Social

Structural clone of the Madras Mami site. `~/madrasmami-11121041` is READ-ONLY
reference for diffing — never write to it.

## Stack

Vite + React 18 SPA, react-router-dom, shadcn/ui, Tailwind, Supabase, Vercel.
`npm run build` = `vite build` + `scripts/build-seo.mjs`, which pre-renders
static HTML per route from `seo/`. `vercel.json` rewrites each route to it.
This is what makes the SPA crawlable — do not break it.

## Rules

- Structure, layout, sections, components and ordering do not change.
  Content, images, brand tokens and business details do.
- Business data lives in `seo/site.mjs`, `seo/routes.mjs`, `seo/schema.mjs`.
  Address, phone, hours, socials, menu, titles and meta all belong there.
- Never invent copy, hours, menu items, prices or contact details.
  If a value is missing, stop and ask.
- Values marked `PENDING` are known-missing. Render a fallback (disabled
  button with the real label, or hide the section), never a dead link or a
  placeholder URL. Omit the field from JSON-LD rather than emitting the
  string. Keep `PENDING.md` current.
- Work one route at a time. After each, diff against the source and confirm
  the changes are content-only.
- Every key is an env var, documented in `.env.example`, with a graceful
  fallback when unset.
- Run `npm run build` before declaring any task complete.

## Brand

Carbon `#1f1b1a`, Curry Leaf `#414c2a`, Burnt Terracotta `#a83d24`,
Muted Olive `#a59976`, Warm Linen `#ece4d8`, Antique Gold gradient.

New Icon (display), Aksen (body), Seruni (accent — eyebrows, labels and nav
only, never body or headings).

## Voice — "The Host"

Warm, unhurried, quietly confident. Short sentences, specific nouns. Say the
dish, say where it's from, stop.

Never "authentic", "culinary journey", "a feast for the senses", or any
generic restaurant marketing language. Madras Mami's site explains South
Indian food to people who might not know it. Madras Social assumes you are an
adult who can read a menu.

## Not vegetarian

Madras Mami was 100% vegetarian and its schema hardcodes that. Madras Social
serves chicken, mutton, lamb, pomfret, lobster and shrimp. Every vegetarian
claim inherited from the source is wrong and must be removed or made
per-item.
