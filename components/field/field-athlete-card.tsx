"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"

export function FieldAthleteCard({
  player,
  selected,
  metric,
  onClick,
}: {
  player: LiveFieldPlayer
  selected: boolean
  metric: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -5, scale: selected ? 1.02 : 1.01 }}
      transition={spring}
      className={cn(
        "relative h-24 w-52 shrink-0 overflow-hidden rounded-2xl bg-card/25 text-left will-change-transform",
        selected && "bg-card/45 ring-1 ring-foreground/35",
      )}
    >
      <Image src={player.photo} alt={player.fullName} fill sizes="208px" className="object-cover object-top opacity-58" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
      <div className="relative z-10 flex h-full items-end justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold leading-none">{player.number}</span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/45">{player.position}</span>
          </div>
          <span className="mt-2 block truncate text-sm font-semibold">{player.name}</span>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/70">{metric}</span>
        </div>
        <div className="flex flex-col items-end gap-1 text-[9px] uppercase tracking-[0.12em]">
          {player.signal === "offline" ? <WifiOff className="size-3.5 text-alert" /> : <Wifi className="size-3.5 text-good" />}
          <span className={cn(player.availability === "alerta" ? "text-alert" : player.availability === "monitorar" ? "text-warn" : "text-good")}>
            {player.availability}
          </span>
        </div>
      </div>
    </motion.button>
  )
}
