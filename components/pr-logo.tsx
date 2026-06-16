import Image from "next/image"
import { cn } from "@/lib/utils"

export function PrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-end gap-0 pt-0.5 text-right", className)}>
      <span className="text-[4px] font-medium tracking-[0.18em] text-foreground/35 md:text-[5px]">POWERED BY</span>
      <Image
        src="/pr-logo-outline.png"
        alt="PR Logic Sports"
        width={52}
        height={52}
        className="h-auto w-9 object-contain md:w-11 lg:w-[52px]"
      />
      <span className="text-[4px] font-semibold tracking-[0.14em] text-foreground/55 md:text-[5px]">
        PR LOGIC SPORTS
      </span>
    </div>
  )
}
