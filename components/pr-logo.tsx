import Image from "next/image"
import { cn } from "@/lib/utils"

export function PrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-end gap-0.5 pt-1 text-right", className)}>
      <span className="text-[7px] font-medium tracking-[0.24em] text-foreground/35 md:text-[8px]">POWERED BY</span>
      <div className="relative h-9 w-14 overflow-hidden md:h-11 md:w-[68px] lg:h-14 lg:w-[88px]">
        <Image
          src="/pr-logo-outline.png"
          alt="PR Logic Sports"
          width={512}
          height={512}
          className="absolute left-1/2 top-1/2 h-auto w-[130px] max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[158px] lg:w-[204px]"
        />
      </div>
      <span className="text-[7px] font-semibold tracking-[0.18em] text-foreground/55 md:text-[8px]">
        PR LOGIC SPORTS
      </span>
    </div>
  )
}
