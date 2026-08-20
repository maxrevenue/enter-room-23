/**
 * Cloudflare Worker entry for Room 23 (OpenNext).
 *
 * Source of truth for the Worker `fetch` handler. After
 * `opennextjs-cloudflare build`, `scripts/wrap-opennext-worker.mjs` installs
 * this file as `.open-next/worker.js` (wrangler main) and renames the generated
 * OpenNext entry to `.open-next/opennext-worker.js` — so bindings and custom
 * domains in wrangler.jsonc stay untouched.
 *
 * All requests are passed through to the generated OpenNext storefront handler.
 * External apps (e.g. Polsia) use dedicated subdomains via DNS CNAMEs, not Worker path proxies.
 */
// @ts-expect-error — generated at build time by @opennextjs/cloudflare
import openNext from "./opennext-worker.js";

// Re-export Durable Object classes when OpenNext caching features enable them.
// @ts-expect-error — generated at build time by @opennextjs/cloudflare
export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./opennext-worker.js";

export default {
  async fetch(request, env, ctx) {
    return openNext.fetch(request, env, ctx);
  },
};
