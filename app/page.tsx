import type { Metadata } from "next";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PRODUCTS, productPath } from "@/lib/products";
import { JOURNAL_ARTICLES } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Room 23 — Premium Adult Wellness",
  description:
    "Considered pleasure. Curated essentials. Physical wellness goods, privately delivered. 18+ only.",
};

const FEATURED = [
  PRODUCTS.find((p) => p.id === "lube-silicone-4oz"),
  PRODUCTS.find((p) => p.id === "ds-glass-wand"),
  PRODUCTS.find((p) => p.id === "ds-massage-oil"),
  PRODUCTS.find((p) => p.id === "ds-silk-blindfold"),
].filter(Boolean);

export default function HomePage() {
  return (
    <main className="bg-zinc-950 text-white">
      <section
        aria-labelledby="hero-title"
        className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
          Curated essentials
        </p>

        <h1
          id="hero-title"
          className="font-serif text-4xl tracking-[0.3em] text-white md:text-5xl"
        >
          ROOM 23
        </h1>

        <p className="mt-8 text-sm font-light tracking-wide text-zinc-400">
          Considered pleasure. Private delivery.
        </p>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <span>Private delivery</span>
          <span className="text-zinc-700">·</span>
          <span>Body-safe materials</span>
          <span className="text-zinc-700">·</span>
          <span>Secure checkout</span>
        </p>

        <Link
          href="/shop"
          className="mt-12 inline-flex items-center justify-center bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-black hover:bg-zinc-200"
        >
          Explore the Collection
        </Link>
      </section>

      <section
        aria-labelledby="featured-rituals-heading"
        className="border-t border-zinc-800 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center md:mb-16">
            <h2
              id="featured-rituals-heading"
              className="font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              Featured Rituals
            </h2>
            <p className="mt-4 text-sm font-light tracking-wide text-zinc-500">
              A tightly held edit. Nothing ornamental.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((product) => (
              <li key={product.id}>
                <Link href={productPath(product)} className="group block">
                  <div className="overflow-hidden border border-zinc-800 bg-zinc-900">
                    <AspectRatio ratio={4 / 5}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <h3 className="mt-4 font-serif text-sm tracking-[0.12em] text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    ${product.price.toFixed(2)} USD
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Not sure where to start</p>
        <h2 className="mt-4 font-serif text-xl uppercase tracking-[0.22em]">Which piece</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
          Four objects. A short edit to match the one you actually need.
        </p>
        <Link
          href="/quiz"
          className="mt-8 inline-flex border border-zinc-700 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-zinc-200 hover:border-zinc-500"
        >
          Take the quiz
        </Link>
      </section>

      <section
        aria-labelledby="journal-heading"
        className="border-t border-zinc-800 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center md:mb-16">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Editorial
            </p>
            <h2
              id="journal-heading"
              className="mt-4 font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              From the Journal
            </h2>
          </header>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {JOURNAL_ARTICLES.map((note) => (
              <li key={note.id}>
                <Link href={`/journal/${note.id}`} className="group block border border-zinc-800 bg-zinc-900 p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {note.category}
                  </p>
                  <h3 className="mt-4 font-serif text-lg tracking-wide text-white">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {note.excerpt}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400">
                    Read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
