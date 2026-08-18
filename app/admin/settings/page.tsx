import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateStoreSettings } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getStoreSettings, SHIPPING_ZONE_SLOTS } from '@/lib/admin-settings'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const query = await searchParams
  const settings = await getStoreSettings()
  const zones = Array.from({ length: SHIPPING_ZONE_SLOTS }, (_, index) => settings.shippingZones[index] || {
    name: '',
    countries: [] as string[],
    rate: 0,
  })

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Commerce</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Settings</h1>
      </header>

      {query.error === 'invalid' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          Check shipping rates and support contact fields.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}
      {query.saved === '1' ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <form action={updateStoreSettings} className="max-w-xl space-y-10">
        <fieldset className="space-y-6">
          <legend className={labelClass}>Store</legend>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="storeOpen"
              className="h-4 w-4 border-zinc-700 bg-zinc-950"
              defaultChecked={settings.storeOpen}
            />
            Store open
          </label>
          <p className="text-xs text-zinc-500">When closed, checkout is declined. Secrets stay in environment variables.</p>
          <label className="block">
            <span className={labelClass}>Support email</span>
            <input className={fieldClass} name="supportEmail" type="email" defaultValue={settings.supportEmail} required />
          </label>
          <label className="block">
            <span className={labelClass}>Support phone</span>
            <input className={fieldClass} name="supportPhone" defaultValue={settings.supportPhone} />
          </label>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className={labelClass}>Shipping</legend>
          <label className="block">
            <span className={labelClass}>Flat shipping rate</span>
            <input
              className={fieldClass}
              name="shippingFlatRate"
              type="number"
              min="0"
              step="0.01"
              defaultValue={settings.shippingFlatRate}
              required
            />
          </label>
          <label className="block">
            <span className={labelClass}>Free shipping threshold</span>
            <input
              className={fieldClass}
              name="freeShippingThreshold"
              type="number"
              min="0"
              step="0.01"
              defaultValue={settings.freeShippingThreshold ?? ''}
            />
            <span className="mt-2 block text-xs text-zinc-500">Leave blank to keep the current default.</span>
          </label>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className={labelClass}>Optional shipping zones</legend>
          <p className="text-xs text-zinc-500">Stored for later country-based rates. Checkout still uses the flat rate above.</p>
          {zones.map((zone, index) => (
            <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-zinc-600">Name</span>
                <input className={fieldClass} name={`zoneName${index}`} defaultValue={zone.name} />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-zinc-600">Countries</span>
                <input
                  className={fieldClass}
                  name={`zoneCountries${index}`}
                  defaultValue={Array.isArray(zone.countries) ? zone.countries.join(', ') : ''}
                  placeholder="US, CA"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-zinc-600">Rate</span>
                <input
                  className={fieldClass}
                  name={`zoneRate${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={typeof zone.rate === 'number' ? zone.rate : ''}
                />
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Save settings
        </button>
      </form>
    </section>
  )
}
