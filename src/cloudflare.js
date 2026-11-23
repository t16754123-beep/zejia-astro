import { App } from 'astro/app';
import { handle } from '@astrojs/cloudflare/handler';

export function createExports(manifest) {
  // Pages expects a web response body. Render HTML before returning it in Node compatibility mode.
  const app = new App(manifest, false);
  return { default: { fetch: (request, env, context) => handle(manifest, app, request, env, context) } };
}
