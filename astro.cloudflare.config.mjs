import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import base from './astro.config.mjs';

export default defineConfig({
  ...base,
  outDir: './dist-cloudflare',
  server: { streaming: false },
  adapter: cloudflare(),
});
