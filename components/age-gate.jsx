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
  const open = mounted && !ageVerified

  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto p-0 bg-card border border-border shadow-[0_0_120px_hsl(var(--foreground)/0.06)] text-foreground [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="text-2xl font-light tracking-[0.5em] text-foreground">AW</div>
            <div className="text-[10px] tracking-[0.3em] text-foreground/50 uppercase mt-2">
              Adult Wellness
            </div>
          </div>
          <div className="h-px bg-border mb-8" />
          <DialogHeader className="space-y-5">
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs tracking-[0.3em] text-foreground/70 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Age Verification Required
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-light tracking-tight leading-snug sm:leading-tight text-center">
              You must be <span className="font-serif italic">18 years or older</span> to enter this site.
            </DialogTitle>
            <DialogDescription className="text-foreground/60 text-xs sm:text-sm leading-loose text-center max-w-md mx-auto">
              This website contains adult wellness products intended for mature audiences. By
              entering, you confirm that you are of legal age in your jurisdiction and consent to
              viewing this content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              onClick={declineAge}
              className="w-full sm:flex-1 text-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-border rounded-none h-12 sm:h-11 text-xs tracking-[0.2em] uppercase"
            >
              I am under 18
            </Button>
            <Button
              onClick={confirmAge}
              className="w-full sm:flex-1 bg-foreground text-background hover:bg-foreground/90 font-medium tracking-[0.2em] uppercase rounded-none h-12 sm:h-11 text-xs"
            >
              Enter Site
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
