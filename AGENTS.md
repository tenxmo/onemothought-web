# Project invariants

Durable rules and the reason each one exists. A rule without a reason gets
refactored away by the next person who finds it inconvenient.

Anything with a lifetime — branch state, commit shas, file inventories — is
deliberately not here. To see what a branch contains, diff it:

```sh
git diff --stat main...<branch>
git log --oneline main..<branch>
```

---

## Navigation

**The primary nav is hero-only, not a shared component.** It is a `navLinks`
array local to `src/pages/index.astro`. There is no global nav component to
edit, and adding a route to "the nav" means editing that array. Each route
owns its own chrome; do not extract a shared nav without a deliberate reason.

**`/consulting` renders no social or résumé links.** GitHub, LinkedIn and the
résumé are homepage-only. The consulting page is a single-purpose landing
surface, and outbound links compete with its one call to action.

**Nested routes link to their parent, not to root.** `/logs/[slug]` returns to
`/logs`; top-level pages return to `/`. From an article, the section index is
where the reader came from, so that is where "back" goes. Do not flatten these
into a uniform root link for consistency's sake.

---

## The writing-link gate

**`/consulting` links to `/logs` only when at least `FEATURED_THRESHOLD` (3)
posts qualify.** `src/lib/consulting.ts` counts posts that are non-draft, not
future-dated, and `featured: true`. Below the threshold, production renders
nothing at all. The gate is derived at build time rather than being a manual
toggle, so the link cannot go live pointing at a thin or empty index.

That filter is deliberately stricter than `/logs` itself, which excludes drafts
only. Keep it stricter: a link offered to a prospective client should not
resolve to posts dated into the future.

---

## Layout

**The viewport meta carries `viewport-fit=cover`, and the body's safe-area
padding uses `max()`.** Without `viewport-fit=cover`, `env(safe-area-inset-*)`
reports zero on iOS and any safe-area padding is silently inert. The `max()`
form means a viewport with no insets computes exactly the values that predate
the rule — 48px top, 24px sides, 48px sides at `md` — so it only ever adds
space on hardware that needs it and changes nothing anywhere else.

Left and right are set independently because a notched device applies those
insets asymmetrically depending on rotation. The `md:` variants exist because
landscape width sits above the `md` breakpoint, so a `md:` horizontal rule
would otherwise win and place content inside the inset.

---

## Domains

**`onemothought.com` is canonical.** `onemosolutions.com` must never serve
content, and must never appear in a canonical, OG, or sitemap URL. It exists
only as a redirect source. Two hostnames serving the same pages split ranking
signals and hand the wrong domain to anyone who shares a link.

---

## Where the rest lives

- Dev server, hostnames, preview URLs — `README.md`
- Activating the `onemosolutions.com` redirect — `docs/onemosolutions-redirect.md`
- In-flight branch state — `NOTES.md`

When starting the dev server, prefer background mode: `astro dev --background`,
managed with `astro dev stop`, `astro dev status`, and `astro dev logs`.
Full framework documentation: <https://docs.astro.build>
