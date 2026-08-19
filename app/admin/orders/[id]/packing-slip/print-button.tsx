'use client'

export function PackingSlipPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-zinc-700 bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-950 hover:bg-zinc-200 print:hidden"
    >
      Print
    </button>
  )
}
