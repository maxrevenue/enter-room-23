import { siteConfig } from '@/lib/config';
import { Lock } from 'lucide-react';

export default function CheckoutDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 bg-theme-surface border border-theme-border rounded-sm mb-6">
      <Lock className="w-5 h-5 text-theme-muted shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-theme-muted leading-relaxed">
        <strong className="text-theme-text/90 font-medium">{siteConfig.pciCheckoutWording}</strong>{' '}
        Your charge will appear on your bank statement as{' '}
        <span className="text-theme-text font-mono bg-theme-bg px-1.5 py-0.5 rounded-sm">{siteConfig.billingDescriptor}</span>.
      </p>
    </div>
  );
}
