import Image from "next/image"
import { cn } from "@/lib/utils"

export function PrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-12 flex-col items-center gap-0 pt-0.5 text-center md:w-14", className)}>
      <span className="text-[4px] font-medium leading-none tracking-[0.16em] text-foreground/35 md:text-[5px]">POWERED BY</span>
      <Image
        src="/pr-logo-outline.png"
        alt="PR Logic Sports"
        width={44}
        height={44}
        className="h-auto w-8 object-contain md:w-10 lg:w-11"
      />
      <span className="text-[4px] font-semibold leading-none tracking-[0.12em] text-foreground/55 md:text-[5px]">
        PR LOGIC SPORTS
      </span>
    </div>
  )
}
