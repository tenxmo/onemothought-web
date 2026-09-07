# In-flight work

Short-lived branch state only. Durable rules live in `CLAUDE.md`; dev setup in
`README.md`; the redirect runbook in `docs/onemosolutions-redirect.md`.

---

## `consulting` — unmerged

Adds a `/consulting` route. For what it contains, diff it rather than trusting
a list here:

```sh
git diff --stat main...consulting
git log --oneline main..consulting
```

**Blocker for merge.** The "How it runs" section carries an unfinished block
covering weeks two through four, rendered in
`src/components/consulting/HowItRuns.astro` as a dashed amber panel reading
`TODO — page is unfinished`. That copy is outstanding and is not to be drafted
by anyone else.

Fill it in and delete the block before merging. The panel is deliberately
conspicuous so the page cannot be mistaken for finished while it is present.

Delete this file once the branch merges.
