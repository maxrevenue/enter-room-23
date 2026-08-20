/**
 * Cloudflare Worker entry for Room 23 (OpenNext).
 *
 * Source of truth for the Worker `fetch` handler. After
 * `opennextjs-cloudflare build`, `scripts/wrap-opennext-worker.mjs` installs
 * this file as `.open-next/worker.js` (wrangler main) and renames the generated
 * OpenNext entry to `.open-next/opennext-worker.js` — so bindings and custom
 * domains in wrangler.jsonc stay untouched.
 *
 * `/polsia` is proxied to the secondary Polsia app; all other requests fall
 * through to the generated OpenNext storefront handler.
 */
// @ts-expect-error — generated at build time by @opennextjs/cloudflare
import { default as openNextHandler } from "./opennext-worker.js";

// Re-export Durable Object classes when OpenNext caching features enable them.
// @ts-expect-error — generated at build time by @opennextjs/cloudflare
export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./opennext-worker.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route Polsia secondary app before any storefront / OpenNext logic.
    if (url.pathname.startsWith("/polsia")) {
      url.hostname = "room23.polsia.app";
      return fetch(url, request);
    }

    return openNextHandler.fetch(request, env, ctx);
  },
};
