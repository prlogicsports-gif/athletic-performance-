"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fieldCardMetrics, type FieldCardMetric, type LiveFieldPlayer } from "@/lib/mock-field-session"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import { FieldAthleteCard } from "./field-athlete-card"

export function FieldAthleteCarousel({
  players,
  selectedId,
  cardMetric,
  getMetricValue,
  onSelect,
  onOpenSelected,
  onMetricChange,
}: {
  players: LiveFieldPlayer[]
  selectedId: string
  cardMetric: FieldCardMetric
  getMetricValue: (id: string) => string
  onSelect: (id: string) => void
  onOpenSelected: () => void
  onMetricChange: (metric: FieldCardMetric) => void
}) {
  const activeIndex = Math.max(0, players.findIndex((player) => player.id === selectedId))

  const go = (dir: number) => {
    const next = (activeIndex + dir + players.length) % players.length
    onSelect(players[next].id)
  }

  return (
    <motion.section variants={{ initial: {}, animate: {} }} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Atletas monitorados</span>
        <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
          {fieldCardMetrics.map((metric) => (
            <button
              key={metric.id}
              type="button"
              onClick={() => onMetricChange(metric.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors",
                cardMetric === metric.id ? "bg-foreground text-background" : "bg-surface/70 text-foreground/45 hover:text-foreground",
              )}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative mx-auto h-28 max-w-6xl overflow-hidden"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(-1)
          if (event.key === "ArrowRight") go(1)
          if (event.key === "Enter") onOpenSelected()
        }}
      >
        {players.map((player, index) => {
          let offset = index - activeIndex
          if (offset > players.length / 2) offset -= players.length
          if (offset < -players.length / 2) offset += players.length
          const abs = Math.abs(offset)
          if (abs > 2) return null
          const selected = offset === 0

          return (
            <motion.div
              key={player.id}
              className="absolute left-1/2 top-2 -translate-x-1/2"
              animate={{
                x: offset * 190,
                scale: selected ? 1 : abs === 1 ? 0.86 : 0.72,
                opacity: selected ? 1 : abs === 1 ? 0.75 : 0.46,
                zIndex: 40 - abs,
              }}
              transition={{ ...spring, stiffness: 150, damping: 24 }}
            >
              <FieldAthleteCard
                player={player}
                selected={selected}
                metric={getMetricValue(player.id)}
                onClick={() => (selected ? onOpenSelected() : onSelect(player.id))}
              />
            </motion.div>
          )
        })}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Atleta anterior"
          className="absolute left-0 top-1/2 z-50 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground/70 backdrop-blur transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Proximo atleta"
          className="absolute right-0 top-1/2 z-50 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground/70 backdrop-blur transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </motion.section>
  )
}
