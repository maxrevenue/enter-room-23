export async function POST(request) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    // Stub: persist via Resend/audience when credentials are available.
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Unable to subscribe.' }, { status: 500 })
  }
}
