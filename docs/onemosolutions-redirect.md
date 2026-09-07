# Runbook: activating the onemosolutions.com redirect

**Status: inactive.** Nothing in the repo redirects anything today.

Goal: `onemosolutions.com` and `www.onemosolutions.com`, all paths, return a
301 to `https://onemothought.com/consulting`.

The rules themselves are parked in `vercel.onemosolutions-redirect.jsonc` at
the repo root. They live in a sidecar because Vercel reads only `vercel.json`,
`vercel.json` must be strict JSON, and strict JSON cannot carry a commented-out
block. Vercel also rejects unknown top-level keys, so the rules could not be
parked inside `vercel.json` under an inert name either.

---

## Step 1 — add both domains to the Vercel project

**Do this first.** In the Vercel dashboard: **Project → Settings → Domains**,
add both:

- `onemosolutions.com`
- `www.onemosolutions.com`

Leave **"Redirect to" unset** on both. The config rules do the redirecting, not
the dashboard.

This step is not optional and not reorderable. The rules match on `has.host`,
which can only match a request that actually reaches this project. Until both
domains resolve here, the rules match nothing — and they fail *silently*: the
build succeeds, the deploy is green, and the redirect simply never fires. Doing
step 2 first produces a config that looks correct and does nothing.

## Step 2 — move the rules into `vercel.json`

Copy the `redirects` array out of `vercel.onemosolutions-redirect.jsonc`,
uncomment it, and add it to `vercel.json` as a **top-level key**, alongside
`framework`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "onemosolutions.com" }],
      "destination": "https://onemothought.com/consulting",
      "permanent": true
    },
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.onemosolutions.com" }],
      "destination": "https://onemothought.com/consulting",
      "permanent": true
    }
  ]
}
```

`"permanent": true` is what makes it a 301 rather than a 307.

## Step 3 — redeploy

A config change to `vercel.json` needs a new deployment to take effect.

## Step 4 — verify

```sh
curl -sI https://onemosolutions.com/anything
curl -sI https://www.onemosolutions.com/anything
```

Both must return:

```
HTTP/2 301
location: https://onemothought.com/consulting
```

A `200` means step 1 did not take effect. A `307` means `permanent` is missing
or false. Check an arbitrary deep path, not just `/` — the rules are meant to
collapse every path onto `/consulting`.

---

## Constraint

`onemothought.com` stays canonical. `onemosolutions.com` must never serve
content, and must never appear in a canonical, OG, or sitemap URL. It is a
redirect source and nothing else.
