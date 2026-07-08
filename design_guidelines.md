{
  "project": {
    "name": "Midnight Lounge Storefront (V1)",
    "aesthetic": "Premium minimalist ‘Midnight Lounge’: dark charcoal (#121212) base, crisp white type, neon red accents. Tasteful, discreet, editorial—high-end boutique, not explicit.",
    "implementation_constraints": {
      "ui_stack": "Fable 5 + Feliz (F# React DSL) + Elmish",
      "styling": "Plain CSS only (single styles.css). Use CSS custom properties (design tokens) + BEM-ish class names. No Tailwind, no shadcn, no JS animation libs.",
      "motion": "Pure CSS transitions/animations only; respect prefers-reduced-motion.",
      "testing": "All interactive + key informational elements MUST include data-testid (kebab-case, role-based)."
    }
  },

  "brand_attributes": [
    "luxurious",
    "discreet",
    "editorial",
    "confident",
    "minimal",
    "high-contrast",
    "tactile micro-interactions"
  ],

  "design_tokens": {
    "css_file": "/app/frontend/styles.css",
    "notes": "Define tokens on :root. Avoid gradients except tiny decorative accents (<=20% viewport). No saturated multi-color gradients. Neon red is used as accent, not as large fills.",

    "colors": {
      "base": {
        "--bg": "#121212",
        "--surface-1": "#171717",
        "--surface-2": "#1D1D1D",
        "--surface-3": "#232323",
        "--border": "rgba(255,255,255,0.10)",
        "--border-strong": "rgba(255,255,255,0.18)",
        "--shadow": "rgba(0,0,0,0.55)",
        "--noise": "rgba(255,255,255,0.035)"
      },
      "text": {
        "--text": "rgba(255,255,255,0.92)",
        "--text-muted": "rgba(255,255,255,0.70)",
        "--text-subtle": "rgba(255,255,255,0.55)",
        "--text-inverse": "#121212"
      },
      "accent": {
        "--accent": "#FF2D2D",
        "--accent-2": "#FF4D4D",
        "--accent-soft": "rgba(255,45,45,0.14)",
        "--accent-glow": "rgba(255,45,45,0.35)",
        "--focus-ring": "rgba(255,45,45,0.55)"
      },
      "state": {
        "--success": "#2FE6A6",
        "--warning": "#FFCC66",
        "--danger": "#FF2D2D",
        "--info": "#7DD3FC"
      }
    },

    "typography": {
      "google_fonts": [
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Manrope:wght@300;400;500;600;700&display=swap"
      ],
      "pairing_rationale": "Fraunces for editorial headlines (luxury, magazine feel). Manrope for UI/body (clean, modern, highly legible on dark).",
      "font_tokens": {
        "--font-display": "'Fraunces', ui-serif, Georgia, serif",
        "--font-sans": "'Manrope', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        "--font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      },
      "type_scale": {
        "--text-xs": "0.75rem",
        "--text-sm": "0.875rem",
        "--text-md": "1rem",
        "--text-lg": "1.125rem",
        "--text-xl": "1.25rem",
        "--text-2xl": "1.5rem",
        "--text-3xl": "1.875rem",
        "--text-4xl": "2.25rem",
        "--text-5xl": "3rem"
      },
      "line_height": {
        "--lh-tight": "1.1",
        "--lh-snug": "1.25",
        "--lh-normal": "1.5",
        "--lh-relaxed": "1.7"
      },
      "letter_spacing": {
        "--ls-tight": "-0.02em",
        "--ls-normal": "0em",
        "--ls-wide": "0.08em"
      }
    },

    "spacing": {
      "--space-1": "4px",
      "--space-2": "8px",
      "--space-3": "12px",
      "--space-4": "16px",
      "--space-5": "20px",
      "--space-6": "24px",
      "--space-7": "32px",
      "--space-8": "40px",
      "--space-9": "56px",
      "--space-10": "72px"
    },

    "radii": {
      "--radius-sm": "10px",
      "--radius-md": "14px",
      "--radius-lg": "18px",
      "--radius-pill": "999px"
    },

    "shadows": {
      "--elev-1": "0 10px 30px rgba(0,0,0,0.35)",
      "--elev-2": "0 18px 60px rgba(0,0,0,0.55)",
      "--glow-accent": "0 0 0 1px rgba(255,45,45,0.25), 0 0 24px rgba(255,45,45,0.18)"
    },

    "borders": {
      "--stroke": "1px",
      "--stroke-strong": "1px"
    },

    "motion": {
      "--ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      "--ease-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      "--dur-1": "120ms",
      "--dur-2": "180ms",
      "--dur-3": "260ms",
      "--dur-4": "420ms"
    },

    "layout": {
      "--container-max": "1120px",
      "--gutter": "20px",
      "--header-h": "72px"
    }
  },

  "global_css_architecture": {
    "file": "/app/frontend/styles.css",
    "structure": [
      "1) :root tokens",
      "2) base reset + typography",
      "3) layout utilities (container, stack, cluster)",
      "4) components (header, hero, chips, cards, drawer, footer)",
      "5) states (focus-visible, disabled)",
      "6) media queries",
      "7) prefers-reduced-motion"
    ],
    "base_rules": {
      "body": "background: var(--bg); color: var(--text); font-family: var(--font-sans); text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;",
      "selection": "::selection { background: var(--accent-soft); color: var(--text); }",
      "links": "Use underline-offset + subtle underline; on hover, underline becomes accent.",
      "focus": "Use :focus-visible with 2px ring (box-shadow) using --focus-ring; never remove outline without replacement."
    },
    "noise_overlay": {
      "goal": "Add subtle premium texture without images.",
      "implementation": "Add a fixed pseudo-element on body or .app-shell: background-image: repeating-radial-gradient(...) or a tiny SVG data-uri; opacity <= 0.06; pointer-events:none."
    }
  },

  "grid_and_layout_rules": {
    "container": {
      "class": ".l-container",
      "spec": "max-width: var(--container-max); margin: 0 auto; padding: 0 var(--gutter);"
    },
    "section_spacing": {
      "class": ".l-section",
      "spec": "padding-block: clamp(40px, 6vw, 88px);"
    },
    "stack": {
      "class": ".u-stack",
      "spec": "display:flex; flex-direction:column; gap: var(--space-5);"
    },
    "product_grid": {
      "class": ".product-grid",
      "spec": "display:grid; gap: clamp(14px, 2vw, 22px); grid-template-columns: repeat(2, minmax(0, 1fr));",
      "breakpoints": {
        "min_768": "grid-template-columns: repeat(3, minmax(0, 1fr));",
        "min_1024": "grid-template-columns: repeat(4, minmax(0, 1fr));"
      }
    }
  },

  "components": {
    "header": {
      "classes": ["header", "header__inner", "header__logo", "header__nav", "header__actions"],
      "layout": "Sticky header with subtle backdrop blur (optional) and hairline border. Left: wordmark. Center/left: category nav. Right: cart button with badge.",
      "css_specs": {
        "sticky": "position: sticky; top: 0; z-index: 50; height: var(--header-h);",
        "surface": "background: rgba(18,18,18,0.72); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border);",
        "logo": "Display font, letter-spacing: var(--ls-wide), uppercase optional.",
        "nav": "Use text buttons with underline-on-hover; active category shows accent underline + subtle glow."
      },
      "data_testids": {
        "logo_link": "header-logo-link",
        "nav_all": "header-nav-all",
        "nav_intimate": "header-nav-intimate-wellness",
        "nav_apparel": "header-nav-night-apparel",
        "nav_sensory": "header-nav-sensory-tech",
        "cart_button": "header-cart-button",
        "cart_badge": "header-cart-count-badge"
      }
    },

    "hero": {
      "classes": ["hero", "hero__inner", "hero__kicker", "hero__title", "hero__sub", "hero__cta"],
      "layout": "Editorial hero: left-aligned copy, generous whitespace, one restrained accent line. CTA scrolls to products.",
      "visual": "Use a thin neon red rule (2px) and a soft radial accent glow behind the title (<=20% viewport).",
      "type": {
        "kicker": "Manrope, uppercase, tracking wide, muted",
        "title": "Fraunces, large, tight leading",
        "sub": "Manrope, text-muted, max-width ~52ch"
      },
      "data_testids": {
        "cta_scroll": "hero-scroll-to-products-button"
      }
    },

    "category_filter": {
      "classes": ["chip-row", "chip", "chip--active"],
      "layout": "Horizontal scroll on mobile (no wrap), wraps on desktop. Chips are pill-like but restrained.",
      "states": {
        "default": "border: 1px solid var(--border); background: transparent; color: var(--text-muted);",
        "hover": "border-color: var(--border-strong); color: var(--text);",
        "active": "background: var(--accent-soft); border-color: rgba(255,45,45,0.35); color: var(--text); box-shadow: var(--glow-accent);"
      },
      "data_testids": {
        "filter_all": "category-filter-all",
        "filter_intimate": "category-filter-intimate-wellness",
        "filter_apparel": "category-filter-night-apparel",
        "filter_sensory": "category-filter-sensory-tech"
      }
    },

    "product_card": {
      "classes": [
        "product-card",
        "product-card__media",
        "product-card__img",
        "product-card__body",
        "product-card__meta",
        "product-card__title",
        "product-card__tag",
        "product-card__price",
        "product-card__actions"
      ],
      "layout": "Card with image top, then title + tag + price. Add-to-cart button full width on mobile, inline on desktop.",
      "image_treatment": "Use subtle vignette overlay on images to feel cinematic; keep tasteful product photography.",
      "hover_microinteraction": "On hover: translateY(-2px) + border brightening; image slightly scales (1.02) with opacity shift; avoid heavy glow.",
      "data_testids": {
        "card": "product-card",
        "add_to_cart": "product-add-to-cart-button",
        "price": "product-price-text",
        "category_tag": "product-category-tag"
      }
    },

    "buttons": {
      "classes": ["btn", "btn--primary", "btn--secondary", "btn--ghost", "btn--icon"],
      "style": "Luxury / Elegant: rounded corners (10–14px), subtle elevation, crisp borders.",
      "primary": "Solid near-white text on accent outline? For this brand: primary is dark surface with accent border + accent glow on hover (more premium than full neon fill).",
      "disabled_checkout": "Checkout button present but disabled-styled: opacity 0.55, cursor not-allowed, no hover lift.",
      "motion": "Only transition background-color, border-color, box-shadow, color, opacity (never transition: all). Active press scale(0.98)."
    },

    "badge": {
      "classes": ["badge", "badge--count"],
      "spec": "Small circular badge on cart icon. Background accent, text inverse. Animate count change with a tiny pop (keyframes scale 0.9->1.05->1).",
      "data_testids": {
        "count": "cart-item-count"
      }
    },

    "cart_drawer": {
      "classes": [
        "drawer-overlay",
        "drawer",
        "drawer--open",
        "drawer__header",
        "drawer__title",
        "drawer__close",
        "drawer__content",
        "drawer__footer",
        "cart-item",
        "cart-item__thumb",
        "cart-item__info",
        "cart-item__name",
        "cart-item__meta",
        "cart-item__qty",
        "qty-stepper",
        "qty-stepper__btn",
        "qty-stepper__value",
        "cart-item__remove"
      ],
      "interaction": {
        "open_close": "Overlay fades in (opacity) while drawer slides from right (transform).",
        "focus_trap_note": "If implementing focus trap in Elmish later, ensure close button is first focusable and ESC closes.",
        "scroll": "Drawer content scrolls; header/footer fixed within drawer using flex column.",
        "remove_animation": "On remove: add class .is-removing to cart-item -> opacity 0 + translateX(-8px) over 160ms."
      },
      "sizes": {
        "width": "min(420px, 92vw)",
        "padding": "24px",
        "border": "1px solid var(--border)"
      },
      "empty_state": {
        "tone": "Discreet, editorial: short line + suggestion to explore categories.",
        "visual": "Use a thin accent rule and muted copy; no illustrations needed."
      },
      "data_testids": {
        "overlay": "cart-drawer-overlay",
        "drawer": "cart-drawer",
        "close": "cart-drawer-close-button",
        "empty": "cart-drawer-empty-state",
        "line_item": "cart-line-item",
        "qty_decrease": "cart-qty-decrease-button",
        "qty_increase": "cart-qty-increase-button",
        "remove": "cart-remove-line-item-button",
        "subtotal": "cart-subtotal-text",
        "total": "cart-total-text",
        "checkout": "cart-checkout-button"
      }
    },

    "footer": {
      "classes": ["footer", "footer__inner", "footer__links", "footer__fineprint"],
      "layout": "Minimal footer with discreet links and fineprint. Use border-top hairline.",
      "data_testids": {
        "footer": "site-footer"
      }
    }
  },

  "responsive_breakpoints": {
    "mobile_first": true,
    "breakpoints": {
      "--bp-sm": "480px",
      "--bp-md": "768px",
      "--bp-lg": "1024px",
      "--bp-xl": "1280px"
    },
    "rules": [
      "Mobile: header nav becomes horizontally scrollable; cart button stays visible.",
      "Tablet+: hero becomes two-column optional (copy + subtle decorative panel).",
      "Desktop: product grid 4 columns; drawer width 420px; more whitespace."
    ]
  },

  "micro_interactions": {
    "principles": [
      "Use motion to confirm actions (add/remove/qty change), not to decorate.",
      "Animate only transform/opacity for performance.",
      "Keep durations 120–260ms; drawer 420ms."
    ],
    "recipes": {
      "button_hover": "hover: translateY(-1px) + border brighten + subtle shadow; active: scale(0.98)",
      "chip_active": "active chip gets accent-soft background + glow-accent",
      "badge_pop": "on count change add .badge--pop for 220ms keyframe",
      "drawer_open": "overlay opacity 0->1; drawer translateX(100%)->0",
      "card_hover": "card lifts 2px; image scales 1.02; border becomes stronger"
    },
    "reduced_motion": "@media (prefers-reduced-motion: reduce) { set durations to 1ms; disable keyframes; keep state changes instant. }"
  },

  "accessibility": {
    "contrast": "Ensure accent red is used for borders/rings, not long text. Body text uses rgba white 0.92 on #121212 for comfortable contrast.",
    "focus_visible": "All interactive elements must show a visible focus ring (box-shadow) using --focus-ring.",
    "hit_targets": "Minimum 44x44px for icon buttons (cart, close, qty +/-).",
    "keyboard": "Drawer must be closable via ESC (if implemented) and close button must be reachable first.",
    "aria": [
      "Cart button: aria-label='Open cart'",
      "Drawer: role='dialog' aria-modal='true' aria-labelledby='cart-title'",
      "Close button: aria-label='Close cart'"
    ]
  },

  "image_urls": {
    "notes": "Use tasteful, abstract, premium product photography. Avoid explicit imagery. Prefer dark, high-contrast still-life shots.",
    "hero_background_optional": [
      {
        "category": "hero",
        "description": "Abstract dark fabric folds / velvet texture (subtle, luxurious).",
        "url": "https://images.unsplash.com/photo-1520975958225-1c1f0b0b0b0b?auto=format&fit=crop&w=2400&q=80"
      }
    ],
    "product_placeholders": [
      {
        "category": "product",
        "description": "Minimal dark still-life product shot placeholder.",
        "url": "https://images.unsplash.com/photo-1520975682031-ae3f1f2b3c4d?auto=format&fit=crop&w=1600&q=80"
      },
      {
        "category": "product",
        "description": "Tech accessory / gadget on dark surface placeholder.",
        "url": "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80"
      },
      {
        "category": "product",
        "description": "Nightwear fabric / textile detail placeholder.",
        "url": "https://images.unsplash.com/photo-1520975867597-0f1b2c3d4e5f?auto=format&fit=crop&w=1600&q=80"
      }
    ]
  },

  "css_scaffolds": {
    "critical_snippets": {
      "drawer": ".drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);opacity:0;pointer-events:none;transition:opacity var(--dur-3) var(--ease-out);}\n.drawer-overlay.is-open{opacity:1;pointer-events:auto;}\n.drawer{position:fixed;top:0;right:0;height:100dvh;width:min(420px,92vw);background:var(--surface-2);border-left:1px solid var(--border);transform:translateX(102%);transition:transform var(--dur-4) var(--ease-out);box-shadow:var(--elev-2);}\n.drawer.is-open{transform:translateX(0);} ",
      "focus_ring": ".btn:focus-visible,.chip:focus-visible,.icon-btn:focus-visible{outline:none;box-shadow:0 0 0 2px rgba(18,18,18,0.9), 0 0 0 4px var(--focus-ring);}"
    },
    "do_not": [
      "Do not use transition: all",
      "Do not center-align the entire app container",
      "Do not use large neon red fills for big surfaces; keep it as accent",
      "Do not use saturated gradients"
    ]
  },

  "instructions_to_main_agent": {
    "file_to_create": "/app/frontend/styles.css",
    "how_to_apply": [
      "Add <link rel='stylesheet' href='styles.css'> in the HTML template used by Fable build (or import in entry if bundler supports).",
      "In Feliz components, apply className strings exactly as specified (BEM-ish).",
      "Add data-testid attributes to every interactive element and key info text (prices, totals, empty state).",
      "Implement drawer open/close by toggling .is-open on overlay and drawer; lock body scroll by toggling .is-locked on body (overflow:hidden).",
      "Use semantic HTML elements via Feliz (header/nav/main/section/footer, buttons for actions)."
    ],
    "recommended_dom_structure": {
      "app_shell": "<div class='app-shell'> <header class='header'>…</header> <main>…</main> <footer class='footer'>…</footer> <div class='drawer-overlay'>…</div> <aside class='drawer' role='dialog'>…</aside> </div>"
    }
  }
}

---

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
