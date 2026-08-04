# PROJECT CONTEXT — Room 23

> Auto-generated from full repository scan.  
> Keep this file updated as the project evolves.

---

## 1. Overview

**Room 23** is a premium adult wellness e-commerce storefront. Built as a single-page Next.js application with App Router, deployed on Cloudflare Workers. Features age verification, product catalog, cart, secure checkout via NMI, and privacy-conscious analytics.

---

## 2. Tech Stack & Primary Dependencies

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Runtime | React | 19.x |
| Styling | Tailwind CSS | v4 |
| UI Primitives | shadcn/ui + Radix UI | latest |
| Icons | Lucide React | latest |
| Class utilities | `clsx` + `tailwind-merge` | latest |
| Deployment | Cloudflare Workers (via `@opennextjs/cloudflare`) | latest |
| Payment Gateway | NMI (Network Merchants Inc.) | REST API |
| Transactional Email | Resend | REST API |
| Testing | Vitest (unit) + Playwright/qabot (E2E) | latest |
| Package Manager | npm | latest |

---

## 3. Folder Structure & Key Files

```
.
├── app/                          # Next.js App Router (pages + API routes)
│   ├── layout.js                 # Root layout: metadata, AgeGate, SiteShell, CartProvider
│   ├── page.js                   # Landing / home page (hero + product cards)
│   ├── globals.css               # Tailwind v4 global styles + custom brand theme
│   ├── providers.js              # Client boundary — wraps children with CartProvider, CartSheet, CheckoutDialog
│   ├── not-found.js              # 404 page
│   ├── robots.js                 # robots.txt (staging → Disallow: /)
│   ├── sitemap.js                # XML sitemap
│   ├── products/page.js          # Product catalog page
│   ├── faq/page.js               # FAQ page
│   ├── shipping/page.js          # Shipping information page
│   ├── contact/page.js           # Contact page
│   ├── order-confirmed/          # Post-checkout confirmation
│   │   ├── page.js               # Server component (wraps client)
│   │   └── order-confirmed-client.js  # Client component: order ID display, cart clearing
│   ├── vault/page.js             # Members-only area (placeholder / coming soon)
│   ├── archive/page.js           # Vintage finds (placeholder / coming soon)
│   ├── terms/page.js             # Legal: Terms of Service
│   ├── terms-of-service/page.js  # Legal: Terms of Service (alternate path)
│   ├── privacy-policy/page.js    # Legal: Privacy Policy
│   ├── refund-policy/page.js     # Legal: Refund Policy
│   └── api/
│       ├── checkout/route.js     # POST — process payment via NMI, validate inventory, send confirmation email
│       ├── analytics/route.js    # POST — server-side PII-sanitized analytics ingestion
│       └── [[...path]]/route.js  # Catch-all mock API for unhandled routes
│
├── components/                   # React components (all .jsx)
│   ├── ui/                       # shadcn/ui primitives (button, dialog, sheet, input, label, separator, etc.)
│   ├── site-shell.jsx            # Layout wrapper: header + main + footer + staging banner
│   ├── site-header.jsx           # Top navigation with mobile hamburger + cart icon/badge
│   ├── site-footer.jsx           # Footer with links, legal, newsletter CTA
│   ├── age-gate.jsx              # Age verification dialog (18+, locks entire site until confirmed)
│   ├── cart-sheet.jsx            # Slide-out cart sidebar with qty controls + checkout trigger
│   ├── checkout-dialog.jsx       # Full checkout form (contact, shipping, payment) with NMI integration
│   └── json-ld.jsx               # Schema.org structured data for SEO
│
├── lib/                          # Business logic & utilities
│   ├── cart-context.js           # React Context state management for cart (add/remove/updateQty/clearCart/subtotal)
│   ├── products.js               # Product catalog data (hardcoded array of product objects with id, name, price, image, description)
│   ├── config.js                 # App-wide constants (brand name, billing descriptor, URLs, etc.)
│   ├── shipping.js               # Shipping zone calculation and rate logic
│   ├── fulfillment.js            # Order fulfillment pipeline (inventory check → payment → supplier order → email)
│   ├── inventory.js              # Inventory management with supplier adapter integration
│   ├── analytics.js              # Server-side: PII sanitization (IP truncation, SHA-256 email hashing), fire-and-forget event tracking
│   ├── analytics-client.js       # Client-side: non-blocking `track(event, data)` → POST /api/analytics
│   ├── env.js                    # Environment detection (development / staging / production)
│   ├── utils.js                  # `cn()` — className merge utility (clsx + twMerge)
│   ├── constants/
│   │   └── testIds/              # Central registry of data-testid constants for E2E testing
│   │       ├── index.js          # Re-exports all test ID modules
│   │       ├── auth.js           # LOGIN, REGISTER, LOGOUT test IDs
│   │       └── home.js           # HOME test IDs
│   └── suppliers/                # Supplier adapter pattern for dropshipping
│       ├── base.js               # Abstract SupplierAdapter class (checkInventory, submitOrder, getTracking)
│       └── mock.js               # MockSupplier — configurable failure modes for testing
│
├── hooks/                        # Custom React hooks
│   ├── use-scroll-to.js          # Scroll to element by selector
│   └── use-scroll-to.jsx         # (Duplicate, same hook in JSX format)
│
├── tests/                        # Unit & integration tests
│   ├── analytics.test.mjs        # Analytics sanitization tests
│   ├── env.test.mjs              # Environment detection tests
│   ├── suppliers.test.mjs        # Supplier adapter tests
│   └── __init__.py               # Python test init (qabot integration)
│
├── next.config.js                # Next.js configuration
├── open-next.config.ts           # OpenNext config for Cloudflare Workers
├── tailwind.config.js            # Tailwind CSS configuration (v4, custom brand theme)
├── wrangler.jsonc                # Cloudflare Workers config (prod + staging envs, KV, vars)
├── components.json               # shadcn/ui configuration
├── postcss.config.js             # PostCSS config (Tailwind plugin)
├── package.json                  # Dependencies & scripts
└── STAGING.md                    # Staging deployment guide & release checklist
```

---

## 4. Routing Map

| Route | File | Type | Notes |
|---|---|---|---|
| `/` | `app/page.js` | Server | Landing page with hero + product showcase |
| `/products` | `app/products/page.js` | Client | Full product catalog with cart integration |
| `/faq` | `app/faq/page.js` | Client | FAQ accordion |
| `/shipping` | `app/shipping/page.js` | Client | Shipping policies & info |
| `/contact` | `app/contact/page.js` | Client | Contact form |
| `/order-confirmed` | `app/order-confirmed/page.js` | Server→Client | Post-checkout confirmation |
| `/vault` | `app/vault/page.js` | Client | Members-only area (coming soon) |
| `/archive` | `app/archive/page.js` | Client | Vintage pieces (coming soon) |
| `/terms` | `app/terms/page.js` | Server | Terms of Service |
| `/terms-of-service` | `app/terms-of-service/page.js` | Server | Terms (alternate path) |
| `/privacy-policy` | `app/privacy-policy/page.js` | Server | Privacy Policy |
| `/refund-policy` | `app/refund-policy/page.js` | Server | Refund Policy |
| `*` (404) | `app/not-found.js` | Server | Custom 404 page |
| `/api/checkout` | `app/api/checkout/route.js` | API POST | Process payment |
| `/api/analytics` | `app/api/analytics/route.js` | API POST | Ingest analytics event |
| `/api/*` | `app/api/[[...path]]/route.js` | API catch-all | Mock responses |

---

## 5. Component Architecture

```
<RootLayout>                          # app/layout.js
  ├── <AgeGate />                      # Full-screen dialog, locks site until 18+ confirmed
  └── <CartProvider>                   # lib/cart-context.js — React Context
      └── <SiteShell>                  # components/site-shell.jsx
          ├── [Staging Banner]         # Conditionally rendered (gold "STAGING" bar)
          ├── <SiteHeader />           # Nav: logo, menu links (mobile hamburger), cart icon + badge
          ├── <main>{children}</main>  # Page content
          ├── <SiteFooter />           # Footer: links, legal, newsletter
          └── <CartSheet />            # Slide-out cart (Sheet from shadcn)
              └── → opens <CheckoutDialog />  # Full checkout form (Dialog from shadcn)
```

**Key structural notes:**
- `AgeGate` renders a non-dismissable `Dialog` (blocks Escape + outside clicks) until `ageVerified === true`. State persisted in `CartContext`.
- `SiteShell` reads `getDeploymentEnv()` and conditionally renders a gold staging banner + injects noindex meta tags.
- `CartSheet` and `CheckoutDialog` render inside `CartProvider` but outside the main page tree (portaled via shadcn).

---

## 6. Data Fetching & State Management

### Cart State (`lib/cart-context.js`)
- **Pattern**: React Context + `useReducer`-style state updates
- **State shape**: `{ cart: [items], cartOpen: bool, checkoutOpen: bool, ageVerified: bool, mounted: bool }`
- **Persistence**: Server-rendered HTML uses default empty cart; client hydrates on mount (`mounted` flag prevents SSR mismatch)
- **Exposed API**: `addItem`, `updateQty`, `removeItem`, `clearCart`, `confirmAge`, `declineAge`, `setCartOpen`, `setCheckoutOpen`, `subtotal`, `itemCount`

### Product Data (`lib/products.js`)
- **Hardcoded catalog** — array of product objects exported as named constants
- Each product: `{ id, name, price, description, image, isNew, isExclusive }`
- Used directly by `page.js` and `products/page.js`; no database or CMS

### Checkout Flow
```
Client (CheckoutDialog)                    Server (api/checkout/route.js)
  │  POST /api/checkout                       │
  │  { items, idempotencyKey, billing }       │
  │ ──────────────────────────────────────────>│
  │                                            │ 1. Validate idempotency key
  │                                            │ 2. Recalculate subtotal from server-side prices
  │                                            │ 3. Check inventory (via supplier adapter)
  │                                            │ 4. Charge via NMI API
  │                                            │ 5. Submit order to supplier (drop-ship)
  │                                            │ 6. Send confirmation email (Resend)
  │                                            │ 7. Fire analytics (non-blocking)
  │  { orderId, total, status }               │
  │ <──────────────────────────────────────────│
  │                                            │
  └─ redirect → /order-confirmed?order=xxx
```
- **Idempotency**: Client generates `r23-{timestamp}-{random}` key; server checks/rejects duplicates
- **Server-side subtotal recalculation**: Prevents client-side price manipulation
- **Client never sees** supplier identity, NMI API keys, cost prices, or margins

### Analytics (`lib/analytics.js` + `lib/analytics-client.js`)
- **Client-side**: `track(event, data)` → fire-and-forget `fetch('/api/analytics', ...)`, never blocks UI
- **Server-side**: `sanitizePayload()` → PII stripped (IP truncated to /16 prefix, email SHA-256 hashed, names/addresses/card data removed)
- **Fire-and-forget**: Analytics endpoint failures never surface to user or block checkout

### Environment Detection (`lib/env.js`)
- Reads `process.env.NODE_ENV` (development) and `process.env.NEXT_PUBLIC_DEPLOYMENT_ENV` (staging/production)
- Three environments: `development` | `staging` | `production`
- Staging: banner shown, titles prefixed `[STAGING]`, noindex meta, robots.txt blocks all, sitemap suppressed

---

## 7. Supplier Adapter Pattern (`lib/suppliers/`)

Abstract base class `SupplierAdapter` defines interface:
- `checkInventory(skus)` → `[{ sku, inStock, availableQuantity, leadTimeDays }]`
- `submitOrder({ orderId, items, shippingAddress })` → `{ supplierOrderId, status, message }`
- `getTracking(supplierOrderId)` → `{ carrier, trackingNumber, status }`

`MockSupplier` implements all three with configurable failure modes for testing:
`NONE` | `TIMEOUT` | `NETWORK_ERROR` | `INVENTORY_UNAVAILABLE` | `ORDER_REJECTED`

Real supplier adapters would extend `SupplierAdapter` with live API credentials (never exposed to client).

---

## 8. Current Feature Status

| Feature | Status | Notes |
|---|---|---|
| Age Gate (18+) | ✅ Complete | Non-dismissable dialog, persisted in cart context |
| Product Catalog | ✅ Complete | Hardcoded products with images |
| Shopping Cart | ✅ Complete | Slide-out sheet, qty controls, subtotal |
| Checkout / Payment | ✅ Complete | NMI integration, idempotency, server-side price validation |
| Order Confirmation | ✅ Complete | Clears cart, shows order ID, discreet shipping info |
| Staging Environment | ✅ Complete | Banner, noindex, blocked robots, wrangler env config |
| Privacy Analytics | ✅ Complete | PII sanitization, fire-and-forget pipeline |
| Supplier Integration | 🔶 Adapter ready | `MockSupplier` works; real supplier adapters TBD |
| Vault (Members) | 🔶 Placeholder | Coming soon page with email waitlist |
| Archive (Vintage) | 🔶 Placeholder | Coming soon page with email waitlist |
| Legal Pages | ✅ Complete | Terms, Privacy, Refund with proper content |
| E2E Testing | 🔶 In progress | Test ID constants defined; test scripts in `tests/` |
| SEO | ✅ Complete | robots.txt, sitemap.xml, JSON-LD, metadata |

---

## 9. Styling Approach

- **Framework**: Tailwind CSS v4 with a fully custom brand design token system
- **Aesthetic**: Dark, premium, minimalist — near-black backgrounds with warm ivory text and neon red accent glows
- **Brand Colors** (defined in `app/globals.css` via `@theme`):
  - `brand-neon-red` — primary accent (glow effects, CTAs)
  - `brand-warm-ivory` — primary text on dark backgrounds
  - `brand-near-black` — main background
  - `brand-surface` — card/surface backgrounds
  - `brand-muted-text` — secondary/tertiary text
  - `brand-gold` — checkout/accent highlights
  - `brand-navy` / `brand-cream` — light-theme checkout form
  - `brand-muted-gold` — vault page accents
- **Typography**: Serif (`font-serif`) for headings, light weights (`font-light`, `font-thin`), tight letter-spacing (`tracking-[0.2em]` etc.)
- **Effects**: Custom `.neon-glow` and `.neon-glow-text` CSS classes for red glow on CTAs and brand text
- **Checkout form**: Uses light palette (`brand-cream`, `brand-navy`) to build trust, contrasting with the dark storefront theme
- **Components**: shadcn/ui primitives (Button, Dialog, Sheet, Input, Label, Separator) styled with Tailwind utility classes, not via shadcn CSS variables
- **Responsive**: Mobile-first with hamburger navigation, `sm:` breakpoints for tablet/desktop

---

## 10. Deployment

### Environments

| Environment | URL | `NEXT_PUBLIC_DEPLOYMENT_ENV` |
|---|---|---|
| Production | (live domain) | `production` or unset |
| Staging | (Cloudflare Worker) | `staging` |
| Development | `localhost:3000` | unset (`NODE_ENV=development`) |

### Commands
```bash
npm run dev          # Local development
npm run cf:build     # Build for Cloudflare Workers
npx wrangler deploy --env staging   # Deploy to staging
```

### Secrets (never in repo)
- `NMI_PRIVATE_KEY` — payment gateway
- `RESEND_API_KEY` — transactional email
- `ADMIN_EMAIL` — order notification recipient

Set via `npx wrangler secret put <NAME> --env staging`.

---

## 11. Key Architectural Decisions

1. **No database** — Products are hardcoded in `lib/products.js`. No CMS, no API for product data.
2. **Client-side state only** — Cart lives entirely in React Context, no server-side sessions or cookies. Clears on page refresh.
3. **Age gate is client-only** — Verification is not cryptographically enforced; relies on user honesty (legal compliance, not DRM).
4. **Supplier adapter pattern** — Abstracted behind `SupplierAdapter` base class for future multi-supplier dropshipping.
5. **Server-side price validation** — Checkout endpoint recalculates subtotal from server-side prices to prevent tampering.
6. **Analytics is fire-and-forget** — All analytics calls use non-blocking patterns; failures never affect UX.
7. **Staging is fully isolated** — Separate Cloudflare Worker environment with banners, noindex, and blocked robots to prevent accidental indexing.
8. **Monorepo-adjacent structure** — Single repository contains all frontend, API routes, business logic, tests, and infrastructure config.

---

*Generated: August 2026 · Update this file when adding new pages, features, or architectural changes.*
