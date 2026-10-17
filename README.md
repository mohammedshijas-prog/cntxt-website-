# CNTXT AI website

Marketing site for CNTXT AI: data captured and verified from real work, models trained on it, and AI deployed on-premise.

Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS modules. No backend and no environment variables.

## Run it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`. Use Node 20.19+ or 22.12+.

This Next.js version has breaking changes. Read the guides in `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).

## Where things are

- `src/app/` — one folder per route, each a thin `page.tsx` with metadata. Also `sitemap.ts`, `robots.ts`, `icon.svg`, `not-found.tsx`.
- `src/components/<page>/` — the page component and its CSS module.
- `src/components/site/` — header, menus and footer.
- `src/components/shared/` — pieces used on several pages, including `graphics.tsx` (illustrations drawn in code).
- `public/art/` — CNTXT's own illustration and cover files.
- `next.config.ts` — redirects `/klkt` to klkt.app and `/munsit` to munsit.com.

## Content rules

The content brief (`docs/content-brief.md`, kept outside the repository; ask the CNTXT team for it) holds every verified fact about the company with its source, the benchmark notes and the wording standard. Copy on the site should come from that brief. Do not add customers, quotes, numbers, people or artwork that are not in it.

## Known gaps

- The contact and partner forms open the visitor's email app; there is no form backend yet.
- Named customers on the home page still need sign-off (see the brief, section 2).
- Leadership cards have no portraits yet.
- The site is laid out on a 1733px frame and scaled with CSS `zoom` between 1201px and 1732px wide. Use `var(--screen-h)` instead of `100vh` for full-height sections.
