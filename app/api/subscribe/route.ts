const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** In-memory placeholder until a real provider (Resend, etc.) is connected. */
const subscribers = new Set<string>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    subscribers.add(email)
    console.log('[subscribe]', email)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Unable to subscribe.' }, { status: 500 })
  }
}
