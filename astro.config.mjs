import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.bitcamp.ge',
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // react-syntax-highlighter is CJS-interop quirky in Vite; needed until
    // Phase 3 replaces react-markdown + react-syntax-highlighter with Astro's
    // built-in Shiki for lesson markdown rendering.
    optimizeDeps: {
      include: ['react-syntax-highlighter'],
    },
  },
});
