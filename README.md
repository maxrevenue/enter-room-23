# Midnight Lounge · After-Hours Essentials

**Premium e-commerce storefront** built with **F#**, **Fable 5**, **Elmish**, **Feliz**, and **Vite**.

> A quietly curated edit of intimate wellness rituals, sleepwear cut from real silk, and sensory technology tuned for the small hours.

---

## 🧰 Tech Stack

| Layer           | Technology                        |
| --------------- | --------------------------------- |
| Language        | F# (compiled to JavaScript via Fable 5) |
| UI              | Feliz (type-safe React bindings)  |
| State           | Elmish MVU (Model‑View‑Update)    |
| Bundler         | Vite 6                            |
| Runtime         | React 18                          |
| Styling         | CSS custom properties (Midnight Lounge dark design system) |

---

## 📋 Prerequisites

| Tool            | Minimum Version | Install                        |
| --------------- | --------------- | ------------------------------ |
| Node.js         | 18+             | [nodejs.org](https://nodejs.org) |
| .NET SDK        | 10.0            | [dotnet.microsoft.com](https://dotnet.microsoft.com) |
| Git             | 2.x             | [git-scm.com](https://git-scm.com) |

Check your versions:

```bash
node --version   # ≥ v18
dotnet --version # ≥ 10.0
git --version
```

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url> midnight-lounge
cd midnight-lounge/frontend

# 2. Install npm dependencies
npm install

# 3. Restore .NET tools (Fable compiler)
dotnet tool restore

# 4. Start dev server with hot reload on http://localhost:3000
npm run dev
```

Saving any `.fs` file triggers automatic F# → JS recompilation and Vite hot module replacement.

---

## 📦 Commands

| Command            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `npm run dev`      | Start dev server with Fable watch + Vite HMR on port **3000** |
| `npm run start`    | Same as `dev`, but also binds to `0.0.0.0` (public network) |
| `npm run build`    | Production build → `dist/` (static files)                    |
| `npm run preview`  | Preview the production build locally                         |

### Build pipeline (local)

```
dotnet tool restore         # restores fable CLI tool (v5.6.0)
    ↓
dotnet fable src/App.fsproj → build/   # F# → JS
    ↓
vite build                              # bundle + optimize → dist/
```

The `dist/` folder is a fully static site — serve it with any static host.

---

## 🌐 Deploy to Vercel

### Option A: Vercel CLI (easiest)

```bash
npm i -g vercel        # one-time
cd frontend
vercel                 # follow prompts — Vercel auto-detects vercel.json
```

### Option B: Web Dashboard

1. Push the repo to GitHub.
2. In Vercel → **New Project** → import the repo.
3. Set **Root Directory** to `frontend`.
4. Vercel will read `vercel.json` automatically (build command, output dir).

**What `vercel.json` does:**

- `installCommand`: `npm install`
- `buildCommand`: `bash build.sh` — installs .NET SDK 10.0, compiles F# → JS, then runs `vite build`
- `outputDirectory`: `dist`

> **Note:** Vercel's Node.js builder doesn't include .NET SDK by default. The `build.sh` script downloads it during build. The first build takes ~90s; subsequent builds are cached.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.fs                # Root Elmish view
│   ├── App.fsproj            # F# project file
│   ├── Data.fs               # Product catalog (typed F# records)
│   ├── Main.fs               # Program entry point
│   ├── State.fs              # Elmish init / update / subscriptions
│   ├── Types.fs              # Domain types + selectors
│   └── Components/
│       ├── CartDrawer.fs     # Slide-out cart with qty steppers
│       ├── Footer.fs
│       ├── Header.fs         # Sticky nav + cart badge
│       ├── Hero.fs
│       └── ProductGrid.fs    # Category filter chips + card grid
├── public/
│   └── styles.css            # Midnight Lounge design system
├── index.html                # Vite entry point
├── package.json
├── vite.config.js
├── dotnet-tools.json         # Fable compiler manifest
├── vercel.json               # Vercel deployment config
├── build.sh                  # Vercel build helper (.NET SDK install)
└── README.md
```

---

## 🎨 Design System

The Midnight Lounge theme is a **premium dark aesthetic**:

- **Background:** `#121212` charcoal black
- **Text:** `rgba(255,255,255,0.92)` crisp white
- **Accent:** `#ff2d2d` neon red with glow effects
- **Typography:** Fraunces (display) + Manrope (body)
- **Components:** Buttons, chips/tags, product cards, drawer, badge — all implemented as CSS utility classes

All tokens are defined as CSS custom properties in `public/styles.css` → `:root`.

---

## 🧪 Architecture

The app follows the **Elmish MVU (Model‑View‑Update)** pattern:

1. **Model** (`Types.fs`): `Model` record holds catalog, cart (`Map<string, CartLine>`), active filter, and drawer state.
2. **Update** (`State.fs`): `update msg model → Model * Cmd<Msg>` — each state transition is an exhaustive pattern match.
3. **View** (`App.fs`, `Components/*.fs`): pure functions of `(Model, dispatch)` returning Feliz HTML.
4. **Selectors** (`Types.fs`): derived data (visible products, cart totals) computed from the model, never stored.
5. **Subscriptions** (`State.fs`): Escape key closes the cart drawer.

The cart is keyed by product ID (`Map<string, CartLine>`) — adding the same product increments its quantity rather than duplicating the line.

---

## 📝 License

MIT — build cool things responsibly.