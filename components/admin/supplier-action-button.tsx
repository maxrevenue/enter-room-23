'use client'

import { useFormStatus } from 'react-dom'

type SupplierActionButtonProps = {
  label: string
  pendingLabel?: string
  className?: string
  disabled?: boolean
}

export function SupplierActionButton({
  label,
  pendingLabel = 'Working…',
  className = '',
  disabled = false,
}: SupplierActionButtonProps) {
  const { pending } = useFormStatus()
  const isDisabled = disabled || pending

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      className={`${className} disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
