import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Product } from "@/lib/types/product";

const CATALOG: Product[] = [
  {
    id: "lube-silicone-4oz",
    name: "Platinum Silicone Lubricant",
    slug: "platinum-silicone-lubricant",
    price: 28,
    description:
      "Medical-grade silicone formula. A single application lasts. Waterproof, condom-safe, and fragrance-free. The definitive choice for shower intimacy, in our own house formulation. 4 oz precision pump.",
    shortEditorial:
      "A concentrated house formula for water, heat, and unhurried time. One pass is enough. Nothing to scent the air. Nothing to announce itself on the nightstand.",
    attributes: [
      "Medical-grade",
      "Ultra-concentrated",
      "Waterproof",
      "Fragrance-free",
      "Latex-compatible",
    ],
    ingredients:
      "Medical-grade dimethicone. Made in the USA with globally sourced FDA-cleared ingredients. Clear, odorless, and free of fragrance, parabens, and glycerin.",
    directions:
      "Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed — the formula is concentrated and long-wearing. Rinse with mild soap and water after use. Recap the pump between uses and store at room temperature, away from direct sun.",
    compatibility:
      "Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys — silicone on silicone will degrade the surface. Not intended for use with silicone barriers or silicone-based devices.",
    discretionNotes:
      "Orders leave in plain, unmarked packaging with no outer branding and no product names on the carton or packing slip. The billing descriptor appears as ROOM23 WELLNESS. The return address carries no indication of contents.",
    images: [
      {
        url: "/images/products/platinum-silicone-lubricant-01.jpg",
        alt: "Platinum Silicone Lubricant 4 oz pump on dark stone",
      },
      {
        url: "/images/products/platinum-silicone-lubricant-02.jpg",
        alt: "Platinum Silicone Lubricant bottle at three-quarter view",
      },
      {
        url: "/images/products/platinum-silicone-lubricant-03.jpg",
        alt: "Platinum Silicone Lubricant pump detail",
      },
      {
        url: "/images/products/platinum-silicone-lubricant-04.jpg",
        alt: "Platinum Silicone Lubricant in discreet room setting",
      },
    ],
    relatedSlugs: [],
  },
];

const CATEGORY_LABEL = "Intimate Essentials";

function getProduct(slug: string): Product | undefined {
  return CATALOG.find((product) => product.slug === slug);
}

export async function generateStaticParams() {
  return CATALOG.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.shortEditorial,
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ image?: string }>;
}) {
  const { slug } = await params;
  const { image } = await searchParams;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const activeIndex = Math.min(
    Math.max(Number.parseInt(image ?? "0", 10) || 0, 0),
    product.images.length - 1,
  );
  const hero = product.images[activeIndex];

  const sections = [
    { title: "Ingredients", body: product.ingredients },
    { title: "Directions", body: product.directions },
    { title: "Compatibility", body: product.compatibility },
    { title: "Discretion", body: product.discretionNotes },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <AspectRatio
              ratio={4 / 5}
              className="overflow-hidden border border-zinc-900 bg-zinc-900"
            >
              <img
                src={hero.url}
                alt={hero.alt}
                className="h-full w-full object-cover"
              />
            </AspectRatio>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((thumb, index) => {
                const isActive = index === activeIndex;

                return (
                  <Link
                    key={thumb.url}
                    href={`/products/${product.slug}?image=${index}`}
                    scroll={false}
                    aria-label={`View image ${index + 1} of ${product.images.length}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`block overflow-hidden border bg-zinc-900 transition-colors ${
                      isActive ? "border-zinc-400" : "border-zinc-900"
                    }`}
                  >
                    <AspectRatio ratio={4 / 5}>
                      <img
                        src={thumb.url}
                        alt={thumb.alt}
                        className="h-full w-full object-cover"
                      />
                    </AspectRatio>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              {CATEGORY_LABEL}
            </p>

            <h1 className="mt-4 font-serif text-3xl font-normal tracking-tight text-white lg:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm tracking-[0.12em] text-zinc-400">
              {formatPrice(product.price)}
            </p>

            <p className="mt-8 max-w-md text-sm leading-7 tracking-wide text-zinc-400">
              {product.shortEditorial}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {product.attributes.map((attribute) => (
                <li
                  key={attribute}
                  className="border border-zinc-900 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400"
                >
                  {attribute}
                </li>
              ))}
            </ul>

            <div className="mt-12 space-y-10 border-t border-zinc-900 pt-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 tracking-wide text-zinc-400">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
