// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://onemothought.com',

  vite: {
    plugins: [tailwindcss()],

    // Dev-only: `astro dev --host` binds to all interfaces, but Vite still
    // rejects unknown Host headers with "Blocked request. This host is not
    // allowed." These are minimo's MagicDNS names on the tailb737bb tailnet.
    server: {
      allowedHosts: ['minimo', 'minimo.tailb737bb.ts.net'],
    },
  },

  integrations: [mdx()]
});