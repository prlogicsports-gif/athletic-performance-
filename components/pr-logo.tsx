import { cn } from "@/lib/utils"

export function PrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <span className="text-[9px] font-medium tracking-[0.25em] text-muted-foreground">POWERED BY</span>
      <div className="flex h-9 items-center justify-center rounded-[3px] bg-foreground px-2.5">
        <span className="font-mono text-xl font-black tracking-tighter text-background">PR</span>
      </div>
      <span className="text-[9px] font-semibold tracking-[0.2em] text-foreground">PR LOGIC SPORTS</span>
    </div>
  )
}
