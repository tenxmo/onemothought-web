// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// Dev-only. `npm run dev` passes --host, which binds beyond localhost, but Vite
// still rejects unrecognised Host headers with "Blocked request. This host is
// not allowed." DEV_ALLOWED_HOSTS is a comma-separated list of extra hostnames
// to accept — a LAN name, or a Tailscale MagicDNS name. It is machine-specific,
// so it lives in .env.local (gitignored) rather than in this file.
//
// Unset is the normal case: no `server` key is emitted at all and Vite's
// default applies, so localhost works out of the box on a fresh clone.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const allowedHosts = (env.DEV_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

// https://astro.build/config
export default defineConfig({
  site: 'https://onemothought.com',

  vite: {
    plugins: [tailwindcss()],
    ...(allowedHosts.length > 0 ? { server: { allowedHosts } } : {}),
  },

  integrations: [mdx()]
});
