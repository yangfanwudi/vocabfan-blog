import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.vocabfan.online',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
