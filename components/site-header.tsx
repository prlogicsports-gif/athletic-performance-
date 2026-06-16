"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { PrLogo } from "./pr-logo"

function useClock() {
  const [time, setTime] = useState("14:32:07")
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setTime(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      )
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function SiteHeader() {
  const time = useClock()
  return (
    <header className="relative grid grid-cols-[1fr_auto_1fr] items-start bg-[#000000] px-5 pt-2 md:px-10 md:pt-3">
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-foreground md:text-xs">
            <motion.span
              className="size-1.5 rounded-full bg-alert md:size-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            />
            AO VIVO
          </span>
          <span className="font-mono text-[10px] tabular-nums text-foreground/55 md:text-xs">{time}</span>
        </div>
        <span className="max-w-[120px] text-[10px] text-foreground/45 md:max-w-none md:text-xs">
          Treino tático • Campo A
        </span>
      </div>

      <div className="relative -mt-1 flex h-12 w-12 justify-center overflow-hidden sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[72px] lg:w-[72px]">
        <Image
          src="/ac-logo-mark.png"
          alt="Athletic Club"
          width={512}
          height={512}
          priority
          className="absolute left-1/2 top-1/2 h-auto w-[144px] max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-[168px] md:w-[192px] lg:w-[216px]"
        />
      </div>

      <PrLogo className="justify-self-end" />
    </header>
  )
}
