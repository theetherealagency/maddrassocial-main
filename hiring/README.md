# Madras Social — pre-launch website

South Indian kitchen + bar, opening soon at 8 Erb Street West, Uptown Waterloo.

Two routes, one deployment:

- `/` — Coming Soon (brand, menu direction, the space, launch list)
- `/careers` — Opening-team hiring (roles, one-screen application, talent pool)

## Stack

Static HTML/CSS/JS — no build step. Deployed on Vercel (`cleanUrls` gives `/careers`).
Forms post to a Google Apps Script owned by hello@madrassocial.ca which writes to
a Google Sheet, saves resumes to Drive, and sends both emails. See `SETUP.md`.

## Edit day-to-day

- `config.js` — backend endpoint + open roles (cards, dropdown and counts render from here)
- `apps-script/Code.gs` — the backend (deployed separately in Google, see `SETUP.md`)
- `styles.css` — design tokens at the top (Palette 01: madras cocoa / burnt terracotta / warm taupe / soft ivory / brushed copper)

## Fonts

Brand faces are **New Icon** (display), **Aksen** (body), **Seruni** (accent) — commercial
licenses. The CSS font stacks name them first and fall back to Italiana / Jost (Google Fonts).
When the licensed webfont files are purchased, add the `@font-face` rules at the top of
`styles.css` and the whole site picks them up automatically.

## Placeholders awaiting client content

Marked with dashed "to be confirmed" chips on the page: opening date, seats & service
periods, pay/shifts/requirements per role, paid-training date, hiring-day date,
chef/owner background, Instagram handle.

---
Site by The Ethereal Agency.
