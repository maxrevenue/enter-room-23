import { siteConfig } from '@/lib/config';
import { Lock } from 'lucide-react';

export default function CheckoutDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-sm mb-6">
      <Lock className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-zinc-400 leading-relaxed">
        <strong className="text-zinc-200 font-medium">Secure checkout:</strong> Your transaction is fully encrypted. For absolute discretion, this charge will appear on your bank statement strictly as <span className="text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded-sm ml-1">{siteConfig.billingDescriptor}</span>.
      </p>
    </div>
  );
}
