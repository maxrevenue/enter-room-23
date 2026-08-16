import type { Metadata } from "next";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const metadata: Metadata = {
  title: "Room 23 — Premium Adult Wellness",
  description:
    "Considered pleasure. Curated essentials. A private collection of adult wellness, selected with restraint.",
};

const FEATURED_RITUALS = [
  {
    href: "/products/platinum-silicone-lubricant",
    name: "Platinum Silicone",
    note: "House formulation",
  },
  {
    href: "/shop",
    name: "Obsidian Glass",
    note: "Temperature play",
  },
  {
    href: "/shop",
    name: "Midnight Bloom",
    note: "Botanical oil",
  },
  {
    href: "/shop",
    name: "Noir Silk",
    note: "Sensory restraint",
  },
] as const;

const JOURNAL_NOTES = [
  {
    href: "/journal/wellness-maintenance",
    tag: "Wellness",
    title: "Building a Considered Collection",
    excerpt: "Where to begin — and why fewer, better pieces make a more meaningful private ritual.",
  },
  {
    href: "/journal/lubricant-formulations",
    tag: "Education",
    title: "The Ritual of Self-Care",
    excerpt: "How intentional routines transform ordinary moments into acts of self-regard.",
  },
  {
    href: "/journal/discreet-luxury",
    tag: "Lifestyle",
    title: "Designing for Desire",
    excerpt: "When objects are made with care, they invite a different kind of attention.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="bg-zinc-950 text-white">
      <section
        aria-labelledby="hero-title"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
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
            {FEATURED_RITUALS.map((ritual) => (
              <li key={ritual.name}>
                <Link href={ritual.href} className="group block">
                  <div className="overflow-hidden border border-zinc-800 bg-zinc-900">
                    <AspectRatio ratio={4 / 5}>
                      <div className="h-full w-full bg-zinc-900" />
                    </AspectRatio>
                  </div>
                  <h3 className="mt-4 font-serif text-sm tracking-[0.12em] text-white">
                    {ritual.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {ritual.note}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
            {JOURNAL_NOTES.map((note) => (
              <li key={note.href}>
                <Link href={note.href} className="group block border border-zinc-800 bg-zinc-900 p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {note.tag}
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
