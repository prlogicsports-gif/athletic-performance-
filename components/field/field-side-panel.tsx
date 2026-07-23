"use client"

import Image from "next/image"
import { AlertTriangle, FileText, Flag, UserRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import type { FieldValuation, LiveFieldPlayer } from "@/lib/mock-field-session"
import { cn } from "@/lib/utils"
import { staggerContainer, staggerItem } from "@/lib/motion"

function availabilityLabel(value: LiveFieldPlayer["availability"]) {
  if (value === "alerta") return "Monitorar"
  if (value === "monitorar") return "Atencao"
  return "Saudavel"
}

function MiniPitch({ player }: { player: LiveFieldPlayer }) {
  return (
    <div className="relative aspect-[105/68] overflow-hidden rounded-2xl bg-[linear-gradient(90deg,rgba(22,80,42,0.28),rgba(13,45,27,0.22))]">
      <div className="absolute inset-[9%] border border-white/22" />
      <div className="absolute bottom-[9%] left-1/2 top-[9%] w-px bg-white/16" />
      <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16" />
      <span
        className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_22px_rgba(255,255,255,0.35)]"
        style={{ left: `${player.fieldPosition.x}%`, top: `${player.fieldPosition.y}%` }}
      />
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-background"
        style={{ left: `${player.fieldPosition.x}%`, top: `${player.fieldPosition.y}%` }}
      >
        {player.number}
      </span>
    </div>
  )
}

export function FieldSidePanel({
  selected,
  valuation,
  insights,
  players,
  onInsight,
}: {
  selected: LiveFieldPlayer
  valuation: FieldValuation
  insights: Array<{ id: string; athleteId: string; valuation: FieldValuation; text: string }>
  players: LiveFieldPlayer[]
  onInsight: (athleteId: string, valuation: FieldValuation) => void
}) {
  const actions: Array<{ label: string; Icon: LucideIcon }> = [
    { label: "Abrir atleta", Icon: UserRound },
    { label: "Comparar", Icon: Flag },
    { label: "Relatorio", Icon: FileText },
  ]
  const teamLoad = Math.round(players.reduce((sum, player) => sum + player.catapult.playerLoad, 0) / Math.max(players.length, 1))
  const teamSprints = Math.round(players.reduce((sum, player) => sum + player.catapult.sprints, 0) / Math.max(players.length, 1))
  const metricCards = [
    { value: `${selected.catapult.playerLoad}`, unit: "UA", label: "Player Load" },
    { value: selected.catapult.distance.toFixed(1), unit: "km", label: "Distancia" },
    { value: `${selected.catapult.sprints}`, unit: "", label: "Sprints" },
    { value: selected.catapult.maxSpeed.toFixed(1), unit: "km/h", label: "Vel. max" },
    { value: `${selected.heartRate.current}`, unit: "bpm", label: "FC atual" },
    { value: `${selected.apollo.recovery}`, unit: "%", label: "Recovery" },
  ]

  return (
    <motion.aside variants={staggerContainer} initial="initial" animate="animate" className="space-y-5 xl:sticky xl:top-20 xl:self-start">
      <motion.section variants={staggerItem} className="relative min-h-44 overflow-hidden rounded-[24px] bg-card/20 p-4">
        <Image src={selected.photo} alt={selected.fullName} fill sizes="330px" className="object-cover object-top opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/74 to-background/30" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] uppercase tracking-[0.22em] text-foreground/35">Atleta</span>
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-[0.18em]",
                selected.availability === "alerta" ? "text-alert" : selected.availability === "monitorar" ? "text-warn" : "text-good",
              )}
            >
              {availabilityLabel(selected.availability)}
            </span>
          </div>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-5xl font-bold leading-none">{selected.number}</span>
            <div>
              <h3 className="text-xl font-semibold leading-none">{selected.name}</h3>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-foreground/45">
                {selected.position} - dados {selected.dataQualityScore}%
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerItem} className="grid grid-cols-2 gap-3">
        {metricCards.map((item) => (
          <div key={item.label} className="rounded-2xl bg-card/18 p-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold leading-none">{item.value}</span>
              {item.unit && <span className="text-[10px] text-foreground/45">{item.unit}</span>}
            </div>
            <span className="mt-2 block text-[8px] font-semibold uppercase tracking-[0.16em] text-foreground/35">
              {item.label}
            </span>
          </div>
        ))}
      </motion.section>

      <motion.section variants={staggerItem} className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-foreground/40">
          <span>Meta carga</span>
          <span>{selected.loadPct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full rounded-full bg-good"
            initial={{ width: 0 }}
            animate={{ width: `${selected.loadPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8 }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div>
            <span className="text-[8px] uppercase tracking-[0.16em] text-foreground/35">Equipe</span>
            <p className="mt-1 font-semibold">{teamLoad} UA media</p>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-[0.16em] text-foreground/35">Sprint medio</span>
            <p className="mt-1 font-semibold">{teamSprints}</p>
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerItem} className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Mini mapa</span>
          <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{valuation}</span>
        </div>
        <MiniPitch player={selected} />
      </motion.section>

      <motion.section variants={staggerItem} className="space-y-3">
        <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Insights</span>
        {insights.map((insight) => (
          <button
            key={insight.id}
            type="button"
            onClick={() => onInsight(insight.athleteId, insight.valuation)}
            className="flex w-full gap-3 rounded-2xl bg-card/18 p-3 text-left text-xs leading-relaxed text-foreground/65 transition-colors hover:text-foreground"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
            {insight.text}
          </button>
        ))}
      </motion.section>

      <motion.section variants={staggerItem} className="flex flex-wrap gap-2">
        {actions.map(({ label, Icon }) => (
          <button key={label} type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/50 transition-colors hover:text-foreground">
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </motion.section>
    </motion.aside>
  )
}
