import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://umami.kitchen',
  integrations: [
    tailwind({
      applyBaseStyles: false, // we import ./src/styles/global.css manually
    }),
  ],
  vite: {
    // Serve the bowl.mp4 with real Range support in dev
    server: { fs: { strict: false } },
  },
});
