import Link from 'next/link'
import { SHOP_CATEGORY_BAR_LINKS } from '@/lib/categories'

type ShopCategoryBarProps = {
  active?: string
}

export default function ShopCategoryBar({ active = 'all' }: ShopCategoryBarProps) {
  return (
    <nav
      aria-label="Shop categories"
      className="sticky z-30 border-b border-theme-border bg-theme-bg/95 backdrop-blur-xl top-[calc(4rem+env(safe-area-inset-top))] sm:top-[calc(4.25rem+env(safe-area-inset-top))] md:top-[calc(7rem+env(safe-area-inset-top))]"
    >
      <div className="relative">
        <ul className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 [mask-image:linear-gradient(to_right,black_0%,black_calc(100%-2.5rem),transparent_100%)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2.5 sm:px-8 md:flex-wrap md:justify-center md:overflow-visible md:[mask-image:none]">
          {SHOP_CATEGORY_BAR_LINKS.map((category) => {
            const isActive = active === category.slug

            return (
              <li key={category.slug} className="shrink-0">
                <Link
                  href={category.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center border px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 sm:px-4 sm:tracking-[0.2em] ${
                    isActive
                      ? 'border-theme-muted text-theme-text'
                      : 'border-theme-border text-theme-muted hover:border-theme-muted hover:text-theme-text'
                  }`}
                >
                  {category.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-theme-bg to-transparent md:hidden"
        />
      </div>
    </nav>
  )
}
