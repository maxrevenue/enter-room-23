import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginAdmin } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await isAdminAuthenticated(await cookies())) {
    redirect('/admin')
  }

  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm border border-zinc-800 bg-zinc-900 px-8 py-10">
        <p className="text-center font-serif text-2xl tracking-[0.28em] text-zinc-100">ROOM 23</p>
        <h1 className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          Admin
        </h1>

        <form action={loginAdmin} className="mt-10 space-y-6">
          <label className="block">
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              autoFocus
              className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </label>

          {hasError ? (
            <p className="text-sm text-zinc-400" role="alert">
              Access denied.
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full bg-zinc-100 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
