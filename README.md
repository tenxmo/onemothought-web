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

### Serving beyond localhost

The `dev` script carries `--host`, so the server binds to the machine's other
interfaces and is reachable over the LAN or a Tailscale tailnet, not just
`localhost`.

The flag lives on the npm script, not in `astro.config.mjs`. **`npx astro dev`
does not pick it up** — it binds to localhost only and gives no indication
anything is missing. Use `npm run dev`.

Vite additionally rejects unrecognised `Host` headers with
`Blocked request. This host is not allowed.` Reaching the server by any name
other than `localhost` therefore needs that name allow-listed.

**`DEV_ALLOWED_HOSTS`** (optional) is a comma-separated list of extra hostnames
to accept. It is machine-specific, so it belongs in `.env.local`, which is
gitignored and never committed:

```sh
# .env.local
DEV_ALLOWED_HOSTS=my-laptop,my-laptop.tailnet-name.ts.net
```

Use the machine's own hostname and, for Tailscale, its MagicDNS name
(`tailscale status --json` reports the latter as `Self.DNSName`).

Leaving it unset is fine and is the default on a fresh clone: no host list is
configured, Vite's own default applies, and `localhost` works. Only access by
another name fails, with the message above. The variable affects dev only and
has no bearing on the static build.

### Preview deployments

Vercel builds a preview for every pushed commit. Preview URLs are per-commit,
not per-branch, and sit behind Vercel SSO — opening one requires being signed
into the Vercel account that owns the project.

To fetch the current URL for a branch:

```sh
gh api "repos/<owner>/<repo>/deployments?per_page=10" \
  --jq '.[] | select(.environment=="Preview") | "\(.sha[0:7]) \(.id)"'
gh api "repos/<owner>/<repo>/deployments/<id>/statuses" \
  --jq '.[0] | "\(.state) \(.environment_url)"'
```

Match the sha against `git rev-parse origin/<branch>` — the newest preview is
not necessarily the branch tip if a later push is still building.

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

### onemosolutions.com redirect

`onemosolutions.com` is intended to 301 to `https://onemothought.com/consulting`.
It is **not active** — nothing in the repo redirects anything today. The rules
are parked in `vercel.onemosolutions-redirect.jsonc`.

Activating them takes dashboard steps as well as a config change, in that
order. The procedure is in **`docs/onemosolutions-redirect.md`**.
