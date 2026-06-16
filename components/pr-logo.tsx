import Image from "next/image"
import { cn } from "@/lib/utils"

export function PrLogo({
  className,
  size = "header",
}: {
  className?: string
  size?: "header" | "footer"
}) {
  const isFooter = size === "footer"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 text-center",
        isFooter ? "w-20" : "w-14 pt-0.5 md:w-16",
        className,
      )}
    >
      <span className={cn("font-medium leading-none tracking-[0.16em] text-foreground/35", isFooter ? "text-[6px]" : "text-[5px]")}>
        POWERED BY
      </span>
      <Image
        src="/pr-logo-solid.png"
        alt="PR Logic Sports"
        width={80}
        height={80}
        className={cn("h-auto object-contain", isFooter ? "w-14" : "w-10 md:w-12 lg:w-14")}
      />
      <span className={cn("font-semibold leading-none tracking-[0.12em] text-foreground/55", isFooter ? "text-[6px]" : "text-[5px]")}>
        PR LOGIC SPORTS
      </span>
    </div>
  )
}
