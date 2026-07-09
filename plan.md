# plan.md

## Objectives
- Ship a working Fable 5 + Elmish + Feliz React storefront (Midnight Lounge theme) that runs locally with Vite HMR on **port 3000**.
- Implement a frontend-only product catalog (F# typed data) with category filtering and a fully functional cart drawer (add/remove/qty, totals).
- Package for GitHub + Vercel: clean repo structure, `.gitignore`, `README.md` with exact scaffold commands, and `vercel.json` build config.

## Implementation Steps

### Phase 1 — Core Toolchain POC (Fable 5 + Vite + Elmish render)
**Goal:** Prove the riskiest part (Fable 5 toolchain + Vite dev server + React rendering + HMR) works before building UI.

**User stories (POC):**
1. As a dev, I can run one command to start a Vite dev server on port 3000.
2. As a dev, saving an `.fs` file triggers a rebuild and page hot reload.
3. As a dev, the app renders a simple Elmish counter/hello view in React.
4. As a dev, `npm run build` produces a static `dist/` output.
5. As a dev, the build output can be served statically without runtime .NET.

**Steps:**
- Web-search current best practice: Fable 5 + Vite plugin, React 18/19, Feliz + Elmish wiring.
- Scaffold repo:
  - Create .NET tool manifest; install/restore `fable` tool.
  - Create `src/App` F# project targeting Fable.
  - Add NuGet deps: `Fable.Core`, `Fable.Elmish`, `Fable.Elmish.React`, `Feliz`.
  - Create Vite app (`index.html`, `src/main.ts/js`) and connect compiled output.
- Verify:
  - `npm install` + `npm run dev` (port 3000).
  - F# → JS compilation runs on file change.
  - Production build succeeds (`npm run build`) and `dist/` loads.
- Fix until stable (do not proceed until all POC user stories pass).

### Phase 2 — V1 Storefront App (Elmish MVU + Midnight Lounge UI)
**Goal:** Build the full storefront around the proven toolchain.

**User stories (V1):**
1. As a shopper, I see a premium dark landing page with header, hero, and product grid.
2. As a shopper, I can filter products by All / IntimateWellness / NightApparel / SensoryTech.
3. As a shopper, I can add a product to cart and see the header cart badge update instantly.
4. As a shopper, I can open/close a cart drawer and review line items and totals.
5. As a shopper, I can change quantities (+/−) and remove items, with totals recalculating correctly.

**Steps:**
- Pull design guidelines from `design_agent` (tokens, spacing, typography, components) and lock a small design system:
  - Colors: bg `#121212`, text `#FFFFFF`, accent neon red, muted grays.
  - Components: buttons, chips/tags, card, drawer, badge.
- Implement Elmish architecture:
  - `Types.fs`: `Category` DU, `Product`, `CartItem`, `Cart` map keyed by product id, `Model`, `Msg`.
  - `State.fs`: `init`, `update` with cart operations (add, inc, dec, remove, open/close drawer, select category).
  - `Selectors.fs` (or `Domain.fs`): subtotal/total, item count, derived view models.
- Build Feliz UI components (semantic + responsive):
  - `Header.fs`: logo, category nav, cart button with badge.
  - `Hero.fs`: headline/subhead + CTA scroll to products.
  - `ProductGrid.fs` + `ProductCard.fs`: image, name, category chip, price, add button.
  - `CartDrawer.fs`: overlay, drawer panel, empty state, line items with qty steppers + remove, subtotal/total.
- Styling:
  - `styles.css` with CSS variables tokens and minimal layout utilities.
  - Responsive grid via CSS grid + media queries.
- Data:
  - Embed ~9–12 products across 3 categories with tasteful names/descriptions; use local/static images or remote placeholders.
- Run one end-to-end test pass with `testing_agent` (flows: filter, add, adjust qty, remove, drawer behavior, responsive).

### Phase 3 — Delivery Packaging (GitHub + Vercel)
**Goal:** Make the repo easy to clone/run and deploy.

**User stories (delivery):**
1. As a dev, I can clone the repo and run documented commands to start dev server.
2. As a dev, I can run a single build command to produce `dist/`.
3. As a dev, I can deploy to Vercel and get a working live site.
4. As a dev, CI/build does not require manual steps beyond config.
5. As a dev, the repo stays clean via correct `.gitignore` (node + dotnet + fable artifacts).

**Steps:**
- Add `README.md`:
  - Exact scaffold/init commands (dotnet tool manifest, package adds, npm install).
  - Dev commands (`npm run dev`), build (`npm run build`), preview.
- Add `vercel.json`:
  - Build command = `npm run build`.
  - Output directory = `dist`.
  - Document .NET requirement; prefer Vercel Node build with scripted .NET SDK install or alternative (GitHub Action build artifact).
- Confirm production build works locally and matches Vercel expectations (static hosting).
- Final regression pass with `testing_agent` on the built/served output.

### Phase 4 — Next Enhancements (optional, post-V1)
**User stories (enhancements):**
1. As a shopper, I can persist my cart in localStorage and restore it on refresh.
2. As a shopper, I can see a product detail modal/page.
3. As a shopper, I can sort products by price/newness.
4. As a shopper, I can apply a promo code (basic rule set) and see updated totals.
5. As a dev, I can add unit tests for cart domain logic.

## Next Actions
1. Run Phase 1 POC scaffolding and verify: Vite on 3000, Elmish renders, HMR works, build outputs `dist/`.
2. Once stable, call `design_agent` for Midnight Lounge tokens/components and implement Phase 2 UI + state.
3. Call `testing_agent` for one E2E pass on V1.
4. Add Vercel + README packaging and validate deployment settings.

## Success Criteria
- `npm run dev` starts Vite on **http://localhost:3000** and hot reload works when editing F#.
- V1 storefront includes header + hero + product grid + category filter + working cart drawer (qty/remove/totals).
- `npm run build` produces a static `dist/` that runs via static hosting.
- Repo is ready for GitHub, and Vercel deploy works using included config/docs.
