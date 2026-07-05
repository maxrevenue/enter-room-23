import { NextResponse } from 'next/server'

// Minimal API surface — MVP shell uses local/mock state only.
export async function GET(_request, { params }) {
  const path = params?.path?.join('/') || ''
  if (path === 'health') {
    return NextResponse.json({ status: 'ok', service: 'aw-holdings-mvp' })
  }
  return NextResponse.json({ ok: true, path })
}

export async function POST(request, { params }) {
  const path = params?.path?.join('/') || ''
  const body = await request.json().catch(() => ({}))

  // Simulated checkout endpoint — always succeeds after mock processing.
  if (path === 'checkout') {
    await new Promise((r) => setTimeout(r, 2000))
    const orderId = 'AW-' + Math.random().toString(36).slice(2, 10).toUpperCase()
    return NextResponse.json({
      status: 'success',
      orderId,
      billedAs: 'AW Holdings LLC',
      received: body,
    })
  }

  return NextResponse.json({ ok: true, path, received: body })
}
