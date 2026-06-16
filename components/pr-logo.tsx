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

  if (isFooter) {
    return (
      <div className={cn("flex w-20 flex-col items-center gap-0 text-center", className)}>
        <span className="font-medium leading-none tracking-[0.16em] text-foreground/35 text-[6px]">
          POWERED BY
        </span>
        <Image
          src="/pr-logo-solid.png"
          alt="PR Logic Sports"
          width={80}
          height={80}
          className="h-auto w-14 object-contain"
        />
        <span className="font-semibold leading-none tracking-[0.12em] text-foreground/55 text-[6px]">
          PR LOGIC SPORTS
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 pt-0.5 text-right",
        className,
      )}
    >
      <Image
        src="/pr-logo-solid.png"
        alt="PR Logic Sports"
        width={80}
        height={80}
        className="h-auto w-9 object-contain md:w-10 lg:w-11"
      />
      <div className="flex flex-col leading-none">
        <span className="font-medium leading-none tracking-[0.16em] text-foreground/35 text-[5px] md:text-[6px]">
          POWERED BY
        </span>
        <span className="mt-1 font-semibold leading-none tracking-[0.12em] text-foreground/55 text-[5px] md:text-[6px]">
          PR LOGIC SPORTS
        </span>
      </div>
    </div>
  )
}
