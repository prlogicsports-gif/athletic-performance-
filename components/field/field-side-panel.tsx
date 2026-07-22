"use client"

import Image from "next/image"
import { AlertTriangle, FileText, Flag, UserRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import type { FieldValuation, LiveFieldPlayer } from "@/lib/mock-field-session"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function FieldSidePanel({
  selected,
  valuation,
  insights,
  onInsight,
}: {
  selected: LiveFieldPlayer
  valuation: FieldValuation
  insights: Array<{ id: string; athleteId: string; valuation: FieldValuation; text: string }>
  onInsight: (athleteId: string, valuation: FieldValuation) => void
}) {
  const actions: Array<{ label: string; Icon: LucideIcon }> = [
    { label: "Abrir analise", Icon: UserRound },
    { label: "Comparar", Icon: Flag },
    { label: "Criar alerta", Icon: AlertTriangle },
    { label: "Gerar relatorio", Icon: FileText },
  ]

  return (
    <motion.aside variants={staggerContainer} initial="initial" animate="animate" className="max-h-[680px] overflow-y-auto rounded-[24px] bg-background/28 p-1">
      <div className="relative min-h-48 overflow-hidden rounded-[22px] bg-card/20 p-4">
        <Image src={selected.photo} alt={selected.fullName} fill sizes="280px" className="object-cover object-top opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/72 to-background/28" />
        <div className="relative z-10">
          <motion.span variants={staggerItem} className="text-[9px] uppercase tracking-[0.22em] text-foreground/35">Atleta selecionado</motion.span>
          <motion.div variants={staggerItem} className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold leading-none">{selected.number}</span>
            <div>
              <h3 className="text-xl font-semibold leading-none">{selected.name}</h3>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-foreground/45">{selected.position} - {selected.availability}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
        {[
          ["Valencia", valuation],
          ["Conexao", `${selected.signalQuality}%`],
          ["Player Load", `${selected.catapult.playerLoad} UA`],
          ["Meta carga", `${selected.loadPct}%`],
          ["Distancia", `${selected.catapult.distance.toFixed(1)} km`],
          ["Dist/min", `${selected.distancePerMinute.toFixed(2)}`],
          ["Vel. max", `${selected.catapult.maxSpeed.toFixed(1)} km/h`],
          ["Sprints", selected.catapult.sprints],
          ["Acel.", selected.catapult.accelerations],
          ["Desacel.", selected.catapult.decelerations],
          ["FC atual", `${selected.heartRate.current} bpm`],
          ["Recovery", `${selected.apollo.recovery}%`],
        ].map(([label, value]) => (
          <motion.div key={label} variants={staggerItem} className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-[0.14em] text-foreground/35">{label}</span>
            <span className="text-sm font-semibold text-foreground">{value}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3 p-4 pt-0">
        <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Insights</span>
        {insights.map((insight) => (
          <button
            key={insight.id}
            type="button"
            onClick={() => onInsight(insight.athleteId, insight.valuation)}
            className="flex w-full gap-3 rounded-2xl bg-card/20 p-3 text-left text-sm leading-relaxed text-foreground/68 transition-colors hover:text-foreground"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
            {insight.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 p-4 pt-0">
        {actions.map(({ label, Icon }) => (
          <button key={label} type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/50 transition-colors hover:text-foreground">
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
    </motion.aside>
  )
}
