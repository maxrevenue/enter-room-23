import { siteConfig } from '@/lib/config';

export default function SoftLaunchBanner() {
  if (!siteConfig.isSoftLaunch) return null;

  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800 text-zinc-300 text-xs tracking-widest text-center py-2 z-[60] relative">
      SOFT LAUNCH — BROWSE THE COLLECTION. SECURE CHECKOUT OPENS ONCE CCBILL IS LIVE.
    </div>
  );
}
