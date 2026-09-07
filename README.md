# onemothought-web

A minimal digital garden, portfolio, and routing layer built with Astro and Tailwind CSS.

Static-rendered, dark by default, typeset in Geist Sans and JetBrains Mono.

---

## Stack

| Layer      | Choice                                  |
| :--------- | :-------------------------------------- |
| Framework  | Astro 7 — static output, no SSR adapter |
| Styling    | Tailwind CSS 4 via `@tailwindcss/vite`  |
| Content    | MDX content collections (`glob` loader) |
| Prose      | `@tailwindcss/typography`               |
| Sans       | Geist Sans (self-hosted, Fontsource)    |
| Mono       | JetBrains Mono (self-hosted, Fontsource)|
| Deployment | Vercel                                  |

Requires Node `>=22.12.0`.

---

## Structure

```text
src/
├── assets/
│   └── brand/           # logo source files; build-time only, never served
├── content/
│   └── logs/            # MDX entries, schema in content.config.ts
├── layouts/
│   └── BaseLayout.astro # <head>, metadata, fonts, global styles
├── pages/
│   ├── index.astro      # /
│   └── logs/
│       ├── index.astro  # /logs
│       └── [slug].astro # /logs/:slug
└── styles/
    └── global.css       # Tailwind entry + base layer
public/                  # served verbatim at the web root (favicons, OG image, resume)
```

Design tokens (`brand.mint`, `brand.dark`, `brand.slate`) live in
`tailwind.config.mjs`, loaded by Tailwind 4 through the `@config`
directive in `global.css`.

---

## Local development

```sh
npm install       # install dependencies
npm run dev       # dev server -> http://localhost:4321
npm run build     # static build -> ./dist
npm run preview   # serve ./dist locally
```

`npm run dev` passes `--host`, so the server also binds to the machine's
other interfaces and is reachable over Tailscale at
`http://minimo.tailb737bb.ts.net:4321`. Vite's host check would otherwise
reject those requests with "Blocked request. This host is not allowed" —
the permitted names are listed under `vite.server.allowedHosts` in
`astro.config.mjs`. Dev only; it has no effect on the static build.

---

## Content

Log entries are MDX files in `src/content/logs/`. Frontmatter is validated
against the schema in `src/content.config.ts`:

```yaml
---
title: "Entry title"
description: "Optional; falls back to a generated meta description."
date: 2026-08-21
tags: ["infrastructure", "astro"]
draft: false
---
```

Entries with `draft: true` are excluded from both `/logs` and route generation.

---

## Deployment

Automatically deployed to Vercel via GitHub integration — every push to
`main` triggers a production build. Build settings are pinned in
`vercel.json` (`npm run build` → `dist`).

### onemosolutions.com redirect (inactive)

`vercel.onemosolutions-redirect.jsonc` holds a parked 301 that would send
all of `onemosolutions.com` to `https://onemothought.com/consulting`.

**It is inactive and does nothing today.** Vercel reads only `vercel.json`,
and that file is strict JSON with no way to carry a commented-out block, so
the rules live in the `.jsonc` alongside it until they're wanted.

Activating it takes two steps, both required:

1. Add **both** `onemosolutions.com` and `www.onemosolutions.com` to the
   Vercel project under Settings → Domains. Until the domains resolve to
   this project, the rules' `has.host` conditions never match, because the
   request never arrives.
2. Copy the `redirects` array out of the `.jsonc` into `vercel.json` as a
   top-level key, then redeploy.

`onemothought.com` stays canonical. `onemosolutions.com` must never serve
content, and must never appear in a canonical, OG, or sitemap URL.
