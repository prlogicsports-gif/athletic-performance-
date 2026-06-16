"use client"

import { motion } from "framer-motion"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { FieldPlayer } from "@/lib/field-data"

export function PlayerFieldCard({
  player,
  selected,
  onSelect,
  compact = false,
}: {
  player: FieldPlayer
  selected?: boolean
  onSelect: (id: string) => void
  compact?: boolean
}) {
  return (
    <motion.button
      type="button"
      layoutId={`field-player-${player.id}`}
      onClick={() => onSelect(player.id)}
      whileHover={{ y: -7, scale: 1.08 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ ...spring, y: { duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      className={cn(
        "group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-background/75 px-2 py-1 text-left backdrop-blur-md will-change-transform",
        selected && "bg-foreground text-background",
        compact && "px-1.5 py-1",
      )}
      style={{ left: `${player.fieldPosition.x}%`, top: `${player.fieldPosition.y}%` }}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-background",
          selected && "bg-background text-foreground",
        )}
        style={{ backgroundColor: selected ? undefined : `var(--${player.colorToken})` }}
      >
        {player.number}
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-semibold">{player.name}</span>
          <span className={cn("mt-0.5 text-[8px] uppercase tracking-[0.14em]", selected ? "text-background/55" : "text-foreground/45")}>
            {player.position} · {player.status}
          </span>
        </span>
      )}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden w-36 -translate-x-1/2 rounded-xl bg-background/90 p-2 text-[9px] text-foreground shadow-2xl backdrop-blur-xl group-hover:block">
        {player.catapult.distance.toFixed(1)} km · {player.catapult.maxSpeed.toFixed(1)} km/h · {player.catapult.playerLoad} UA
      </span>
    </motion.button>
  )
}
