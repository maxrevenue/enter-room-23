export default function SoftLaunchBanner() {
  if (process.env.NEXT_PUBLIC_SOFT_LAUNCH !== 'true') return null

  return (
    <div className="w-full bg-theme-bg border-b border-theme-border py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] text-theme-muted font-medium">
        Local preview — checkout UI is disabled
      </p>
    </div>
  )
}
