import Link from 'next/link'

const CATEGORIES = [
  { slug: 'all', href: '/shop', label: 'All' },
  { slug: 'essentials', href: '/collections/essentials', label: 'Essentials' },
  { slug: 'wellness', href: '/collections/wellness', label: 'Wellness' },
  { slug: 'body', href: '/collections/body', label: 'Body' },
  { slug: 'toys', href: '/collections/toys', label: 'Toys' },
  { slug: 'new-arrivals', href: '/collections/new-arrivals', label: 'New Arrivals' },
] as const

type ShopCategoryBarProps = {
  active?: string
}

export default function ShopCategoryBar({ active = 'all' }: ShopCategoryBarProps) {
  return (
    <nav aria-label="Shop categories" className="-mx-5 border-b border-theme-border sm:-mx-8">
      <ul className="flex items-center gap-6 overflow-x-auto px-5 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 sm:px-8 sm:py-5 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((category) => {
          const isActive = active === category.slug

          return (
            <li key={category.slug} className="shrink-0">
              <Link
                href={category.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative inline-block whitespace-nowrap pb-1 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-theme-text after:transition-transform after:duration-300 after:content-[''] ${
                  isActive
                    ? 'text-theme-text after:w-full after:scale-x-100'
                    : 'text-theme-muted after:w-full after:origin-left after:scale-x-0 hover:text-theme-text/90'
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
