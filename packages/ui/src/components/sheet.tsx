"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Side sheet built on Base UI Dialog — used for mobile navigation.
 * Always renders an accessible Title (sr-only when visually hidden).
 */
function Sheet({ open, onOpenChange, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root
      data-slot="sheet"
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetContent({
  className,
  children,
  side = "right",
  title,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  side?: "left" | "right"
  /** Accessible title; rendered sr-only if not provided via children. */
  title: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed inset-y-0 z-50 flex h-dvh w-full max-w-80 flex-col gap-4 p-6 shadow-xl transition-transform duration-300 ease-out",
          side === "right"
            ? "right-0 data-ending-style:translate-x-full data-starting-style:translate-x-full"
            : "left-0 data-ending-style:-translate-x-full data-starting-style:-translate-x-full",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        {children}
        <SheetClose
          className="ring-offset-background focus-visible:ring-ring absolute top-4 right-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:outline-none"
          aria-label="Close"
        >
          <XIcon className="size-5" aria-hidden="true" />
        </SheetClose>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent }
