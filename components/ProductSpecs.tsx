interface SpecProps {
  composition: string;
  freeFrom?: string[];
  care: string;
  warning?: string;
}

export default function ProductSpecs({ composition, freeFrom = [], care, warning }: SpecProps) {
  return (
    <div className="mt-8 border-t border-theme-border pt-6">
      <h3 className="text-theme-text font-serif text-lg tracking-wide mb-5">Materials & Care</h3>
      <dl className="space-y-5 text-sm">
        <div>
          <dt className="text-theme-muted uppercase tracking-widest text-xs mb-1.5 font-medium">Composition</dt>
          <dd className="text-theme-text/80 leading-relaxed">{composition}</dd>
        </div>
        
        {freeFrom.length > 0 && (
          <div>
            <dt className="text-theme-muted uppercase tracking-widest text-xs mb-1.5 font-medium">Formulated Without</dt>
            <dd className="text-theme-text/80 leading-relaxed">{freeFrom.join(', ')}</dd>
          </div>
        )}
        
        <div>
          <dt className="text-theme-muted uppercase tracking-widest text-xs mb-1.5 font-medium">Care Instructions</dt>
          <dd className="text-theme-text/80 leading-relaxed">{care}</dd>
        </div>
        
        {warning && (
          <div className="bg-red-950/20 border-l-2 border-red-700 p-4 mt-6">
            <dt className="text-red-500 uppercase tracking-widest text-xs mb-1 font-semibold">Compatibility Note</dt>
            <dd className="text-theme-text/80 text-sm leading-relaxed">{warning}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
