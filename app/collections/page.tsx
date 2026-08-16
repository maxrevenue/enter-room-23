import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Collections | Room 23",
  description: "Curated essentials and seasonal edits from Room 23.",
};

const VISIBLE_COLLECTIONS = ["essentials", "new-arrivals", "vintage"] as const;

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          The edit
        </p>
        <h1 className="mt-4 font-serif text-3xl uppercase tracking-[0.22em] text-white md:text-4xl">
          Collections
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
          Tightly held groupings. Nothing ornamental.
        </p>
      </header>

      <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {VISIBLE_COLLECTIONS.map((slug) => {
          const collection = COLLECTIONS[slug];
          return (
            <li key={slug}>
              <Link
                href={`/collections/${slug}`}
                className="block border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700"
              >
                <h2 className="font-serif text-lg tracking-[0.12em] text-white">
                  {collection.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {collection.subtitle}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
