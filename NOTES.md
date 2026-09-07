# Notes

Working notes for the `consulting` branch. See `README.md` for stack,
structure, and deployment.

---

## Branch state

`consulting` is **unmerged**. It adds a `/consulting` route built from
components in `src/components/consulting/`, plus a `featured` boolean on the
`logs` collection schema and a helper in `src/lib/consulting.ts`.

**Blocker for merge:** the "How it runs" section contains a TODO block
covering weeks two through four, rendered in `HowItRuns.astro` as a dashed
amber panel reading `TODO — page is unfinished`. The copy for those weeks is
outstanding. Fill it in and delete the block before merging; the page is
deliberately conspicuous while it is present.

`main` does not contain any of the consulting work.

---

## Conventions

**Back links follow the content hierarchy.** A nested route links to its
parent, not to the site root: `/logs/[slug]` returns to `/logs`. Top-level
pages return to root — `/logs` and `/consulting` each carry a
`<- Return to root` link at the top and bottom of the page.

**Safe-area padding lives on the shared body.** `BaseLayout.astro` sets top
and side padding with `max()` against `env(safe-area-inset-*)`, so a viewport
with no insets computes exactly the previous values (48px top, 24px sides,
48px sides at `md`) and only notched devices see any change. Left and right
are set independently because those insets differ by rotation, and `md:`
variants are included because landscape width sits above the `md` breakpoint.
The viewport meta carries `viewport-fit=cover`, without which `env()` reports
zero on iOS.

**The writing link on `/consulting` is derived, not toggled.**
`src/lib/consulting.ts` counts posts that are non-draft, not future-dated,
and `featured: true`. The link to `/logs` renders only once that count
reaches `FEATURED_THRESHOLD` (3). Below the threshold, production renders
nothing and dev renders a plain count note. Note this filter is stricter than
`/logs` itself, which excludes drafts only. There is no manual switch —
change the threshold or mark another post `featured: true`.

---

## Development

Use `npm run dev`. It carries `--host`, which binds the dev server beyond
localhost for LAN and Tailscale access. A bare `npx astro dev` does **not**
pick this up, since the flag is on the npm script rather than the config.

`vite.server.allowedHosts` in `astro.config.mjs` lists hostnames for one
specific machine. Vite rejects unknown `Host` headers with
`Blocked request. This host is not allowed.`, so this list needs editing to
match whatever machine the server runs on. It affects dev only and has no
bearing on the static build.

---

## Deployment

`vercel.onemosolutions-redirect.jsonc` holds an inactive redirect that does
nothing in its current state. Activation requires steps in the Vercel
dashboard as well as a config change — see **onemosolutions.com redirect
(inactive)** in `README.md` for the full procedure. It is not duplicated here.
