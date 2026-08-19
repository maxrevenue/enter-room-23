import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { detectImageMime, putAdminMediaObject } from '@/lib/admin-media'
import { resolveAdminPassword } from '@/lib/admin-password.server'

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!authed) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 })
  }

  const productId = String(form.get('productId') || 'draft').trim() || 'draft'
  const bytes = await file.arrayBuffer()
  const mime = detectImageMime(new Uint8Array(bytes))
  if (!mime) {
    return NextResponse.json(
      { ok: false, error: 'Unsupported file type. Use JPEG, PNG, WebP, or GIF.' },
      { status: 400 },
    )
  }

  const result = await putAdminMediaObject({ productId, mime, bytes })
  if (result.ok === false) {
    const status = result.error === 'Media storage is not configured.' ? 503 : 400
    return NextResponse.json({ ok: false, error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, url: result.url })
}
