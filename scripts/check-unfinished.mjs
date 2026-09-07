#!/usr/bin/env node
/**
 * Merge guard: fails while an unfinished-content sentinel is present.
 *
 * A page carrying the sentinel must not ship. Exits non-zero so a build or CI
 * job cannot go green while one exists.
 *
 * Run directly:  node scripts/check-unfinished.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SENTINEL = 'TODO — page is unfinished';
const ROOTS = ['src/components/consulting'];
const EXTENSIONS = ['.astro', '.md', '.mdx', '.ts', '.tsx'];

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out; // a configured root that does not exist yet is not a failure
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else if (EXTENSIONS.some((e) => full.endsWith(e))) out.push(full);
  }
  return out;
}

const hits = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (line.includes(SENTINEL)) {
        hits.push({ file: relative(process.cwd(), file), line: i + 1, text: line.trim() });
      }
    });
  }
}

if (hits.length === 0) {
  console.log(`✓ no "${SENTINEL}" sentinel found in: ${ROOTS.join(', ')}`);
  process.exit(0);
}

console.error(`\n✗ Unfinished content present — ${hits.length} occurrence(s) of "${SENTINEL}":\n`);
for (const h of hits) console.error(`    ${h.file}:${h.line}\n      ${h.text}\n`);
console.error('This page is not finished and must not ship. Write the outstanding');
console.error('copy and delete the block, then re-run.\n');
process.exit(1);
