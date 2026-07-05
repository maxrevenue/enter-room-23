'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShieldCheck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function AgeGate() {
  const { mounted, ageVerified, confirmAge, declineAge } = useCart()
  // Only show the gate after hydration; avoids SSR/localStorage flash.
  const open = mounted && !ageVerified

  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto p-0 bg-neutral-900 border-2 border-white/40 shadow-[0_0_120px_rgba(255,255,255,0.08)] text-white [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-6 sm:p-10">
          <div className="text-center mb-5 sm:mb-6">
            <div className="text-2xl font-light tracking-[0.5em] text-white">AW</div>
            <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase mt-1">
              Adult Wellness
            </div>
          </div>
          <div className="h-px bg-white/15 mb-5 sm:mb-6" />
          <DialogHeader className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs tracking-[0.3em] text-white/70 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Age Verification Required
            </div>
            <DialogTitle className="text-xl sm:text-3xl font-light tracking-tight leading-snug sm:leading-tight text-center">
              You must be 18 years or older to enter this site.
            </DialogTitle>
            <DialogDescription className="text-white/60 text-xs sm:text-sm leading-relaxed text-center">
              This website contains adult wellness products intended for mature audiences.
              By entering, you confirm that you are of legal age in your jurisdiction and consent
              to viewing this content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              onClick={declineAge}
              className="w-full sm:flex-1 text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-none h-12 sm:h-11 text-sm"
            >
              I am under 18 — Exit
            </Button>
            <Button
              onClick={confirmAge}
              className="w-full sm:flex-1 bg-white text-black hover:bg-white/90 font-medium tracking-wide rounded-none h-12 sm:h-11 text-sm"
            >
              I am 18 or older — Enter
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
