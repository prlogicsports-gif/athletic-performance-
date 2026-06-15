"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AcLogo } from "./ac-logo"
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
    <header className="relative flex items-start justify-between px-6 pt-6 md:px-10">
      {/* live status */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
            <motion.span
              className="size-2 rounded-full bg-alert"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            />
            AO VIVO
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{time}</span>
        </div>
        <span className="text-xs text-muted-foreground">Treino tático • Campo A</span>
      </div>

      {/* center logo */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <AcLogo className="h-16 w-28" />
      </div>

      {/* PR logo */}
      <PrLogo />
    </header>
  )
}
