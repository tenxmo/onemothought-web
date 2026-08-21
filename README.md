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
public/                  # served verbatim at the web root
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
