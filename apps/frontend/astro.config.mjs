import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'path';

export default defineConfig({
  integrations: [react()],
  server: { port: 1571 },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    define: {
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(
        process.env.PUBLIC_API_URL
      ),
    },
  },
});

