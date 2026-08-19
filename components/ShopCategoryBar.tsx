import Link from 'next/link'
import { SHOP_CATEGORY_BAR_LINKS } from '@/lib/categories'

type ShopCategoryBarProps = {
  active?: string
}

export default function ShopCategoryBar({ active = 'all' }: ShopCategoryBarProps) {
  return (
    <nav aria-label="Shop categories" className="border-y border-theme-border">
      <ul className="flex items-center gap-2 overflow-x-auto py-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2.5 sm:py-4 md:flex-wrap md:justify-center">
        {SHOP_CATEGORY_BAR_LINKS.map((category) => {
          const isActive = active === category.slug

          return (
            <li key={category.slug} className="shrink-0">
              <Link
                href={category.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex min-h-9 items-center border px-3.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:px-4 ${
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
    </nav>
  )
}
