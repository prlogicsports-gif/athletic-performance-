"use client"

import { motion } from "framer-motion"
import { Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"

export function FieldPlayerMarker({
  player,
  selected,
  onSelect,
}: {
  player: LiveFieldPlayer
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <motion.button
      type="button"
      title={`${player.fullName} - dados ${player.dataStatus}`}
      onClick={() => onSelect(player.id)}
      className={cn(
        "absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-background/78 px-1.5 py-1 text-left backdrop-blur-md transition-colors",
        selected && "bg-foreground text-background",
        player.dataStatus !== "validado" && "border border-dashed border-foreground/40 opacity-75",
      )}
      style={{ left: `${player.fieldPosition.x}%`, top: `${player.fieldPosition.y}%` }}
      animate={{ scale: selected ? 1.18 : 1 }}
      transition={spring}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          selected ? "bg-background text-foreground" : "text-background",
        )}
        style={{ backgroundColor: selected ? undefined : `var(--${player.colorToken})` }}
      >
        {player.dataStatus === "pendente" ? <Database className="size-3" /> : player.number}
      </span>
      {selected && (
        <span className="pr-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
          {player.name}
        </span>
      )}
      {player.availability !== "disponivel" && <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-warn" />}
    </motion.button>
  )
}
