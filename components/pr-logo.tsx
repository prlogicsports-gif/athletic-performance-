import Image from "next/image"
import { cn } from "@/lib/utils"

export function PrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-end gap-0 pt-0.5 text-right", className)}>
      <span className="text-[5px] font-medium tracking-[0.22em] text-foreground/35 md:text-[6px]">POWERED BY</span>
      <div className="relative h-6 w-10 overflow-hidden md:h-7 md:w-12 lg:h-8 lg:w-14">
        <Image
          src="/pr-logo-outline.png"
          alt="PR Logic Sports"
          width={512}
          height={512}
          className="absolute left-1/2 top-1/2 h-auto w-[92px] max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[112px] lg:w-[132px]"
        />
      </div>
      <span className="text-[5px] font-semibold tracking-[0.16em] text-foreground/55 md:text-[6px]">
        PR LOGIC SPORTS
      </span>
    </div>
  )
}
