/**
 * Cloudflare Worker entry for Room 23 (OpenNext).
 *
 * Source of truth for the Worker `fetch` handler. After
 * `opennextjs-cloudflare build`, `scripts/wrap-opennext-worker.mjs` installs
 * this file as `.open-next/worker.js` (wrangler main) and renames the generated
 * OpenNext entry to `.open-next/opennext-worker.js` — so bindings and custom
 * domains in wrangler.jsonc stay untouched.
 *
 * `/polsia` is reverse-proxied to the secondary Polsia app at room23.polsia.app
 * (path prefix stripped, Host overridden, redirects rewritten). All other
 * requests fall through to the generated OpenNext storefront handler.
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

const POLSIA_PREFIX = "/polsia";
const POLSIA_HOST = "room23.polsia.app";
const PUBLIC_ORIGIN = "https://room23.net";

function isPolsiaPath(pathname) {
  return pathname === POLSIA_PREFIX || pathname.startsWith(`${POLSIA_PREFIX}/`);
}

function stripPolsiaPrefix(pathname) {
  if (pathname === POLSIA_PREFIX) return "/";
  return pathname.slice(POLSIA_PREFIX.length) || "/";
}

function rewritePolsiaLocation(location, baseUrl) {
  if (!location) return location;

  let loc;
  try {
    loc = new URL(location, baseUrl);
  } catch {
    return location;
  }

  if (loc.hostname !== POLSIA_HOST) return location;

  const proxiedPath =
    loc.pathname === "/" ? POLSIA_PREFIX : `${POLSIA_PREFIX}${loc.pathname}`;
  return `${PUBLIC_ORIGIN}${proxiedPath}${loc.search}${loc.hash}`;
}

async function proxyToPolsia(request) {
  const incoming = new URL(request.url);
  const target = new URL(request.url);
  target.protocol = "https:";
  target.hostname = POLSIA_HOST;
  target.port = "";
  target.pathname = stripPolsiaPrefix(incoming.pathname);

  // New Request so we don't forward Host: room23.net — Polsia rejects that
  // unless the custom-domain DNS check is configured.
  const proxyInit = {
    method: request.method,
    headers: request.headers,
    redirect: "manual",
  };
  if (request.body) {
    proxyInit.body = request.body;
    proxyInit.duplex = "half";
  }

  const proxiedRequest = new Request(target.toString(), proxyInit);
  proxiedRequest.headers.set("Host", POLSIA_HOST);

  const response = await fetch(proxiedRequest);
  const headers = new Headers(response.headers);
  const location = headers.get("Location");
  if (location) {
    headers.set("Location", rewritePolsiaLocation(location, proxiedRequest.url));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route Polsia secondary app before any storefront / OpenNext logic.
    if (isPolsiaPath(url.pathname)) {
      return proxyToPolsia(request);
    }

    return openNextHandler.fetch(request, env, ctx);
  },
};
