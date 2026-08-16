'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS, productPath, getProductById } from '@/lib/products'
import ProductArtwork from '@/components/product-artwork'

const QUESTIONS = [
  {
    id: 'use',
    prompt: 'What are you actually shopping for?',
    options: [
      { id: 'glide', label: 'A reliable glide', productId: 'lube-silicone-4oz' },
      { id: 'skin', label: 'Something for skin, not a device', productId: 'arlo-atlas-oil' },
      { id: 'delay', label: 'A little more time', productId: 'skins-delay' },
      { id: 'mist', label: 'A light mist', productId: 'heli-lavender-mist' },
    ],
  },
]

export default function QuizClient() {
  const [choice, setChoice] = useState(null)
  const product = choice ? getProductById(choice) : null

  return (
    <main className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <p className="last-updated">The current edit. One suggestion.</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '1rem' }}>
        Which piece
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This is not a diagnostic. It points at one object already in the catalog.
      </p>

      {QUESTIONS.map((question) => (
        <div key={question.id} className="space-y-3 mb-10">
          <h2 className="text-sm uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>{question.prompt}</h2>
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setChoice(option.productId)}
              className="block w-full text-left border px-4 py-3 text-sm"
              style={{
                borderColor: choice === option.productId ? '#C8102E' : 'var(--border)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ))}

      {product && (
        <div className="border p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="aspect-square max-w-xs mb-4 overflow-hidden">
            <ProductArtwork product={product} productId={product.id} category={product.category} />
          </div>
          <h3 className="font-syne text-xl mb-2">{product.name}</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{product.shortEditorial}</p>
          <p className="mb-6">${product.price.toFixed(2)} USD</p>
          <Link href={productPath(product)} className="btn-primary inline-flex">View this piece</Link>
        </div>
      )}

      <p className="mt-10 text-sm">
        <Link href="/shop" className="link-brass">Or browse all {PRODUCTS.length} SKUs</Link>
      </p>
    </main>
  )
}
