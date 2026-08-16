import { SITE_CONFIG } from '@/config/site'

export default function SoftLaunchBanner() {
  if (!SITE_CONFIG.softLaunch) return null

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-900 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 font-medium">
        Local preview — checkout UI is disabled
      </p>
    </div>
  )
}
