"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, TrendingUp } from "lucide-react"
import {
  teamMetrics,
  loadZones,
  teamComparison,
  positionComparison,
  accumulatedLoad,
  internalRanking,
  weekAlerts,
  athletes,
} from "@/lib/data"
import { MetricIcon } from "../metric-icon"
import { DonutLoad, Bar, LineChart } from "../viz"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/nav"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { AthleticFieldExperience, type FieldStage } from "@/components/field/athletic-field-experience"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
})

function CountUp({ value }: { value: string }) {
  const target = Number.parseFloat(value.replace(",", "."))
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (Number.isNaN(target)) return
    let frame = 0
    const total = 42
    const id = window.setInterval(() => {
      frame += 1
      const progress = 1 - Math.pow(1 - frame / total, 3)
      setCurrent(target * Math.min(progress, 1))
      if (frame >= total) window.clearInterval(id)
    }, 16)
    return () => window.clearInterval(id)
  }, [target])

  if (Number.isNaN(target)) return <>{value}</>

  const decimals = value.includes(".") || value.includes(",") ? 1 : 0
  return <>{current.toFixed(decimals)}</>
}

function SectionLabel({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{children}</h3>
      {sub && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{sub}</span>}
    </div>
  )
}

export function DashboardScreen({ onSelectAthlete }: { onSelectAthlete: (id: string) => void }) {
  const [fieldOpen, setFieldOpen] = useState<FieldStage | null>(null)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="px-4 pb-16 pt-1 md:px-8">
      {/* header row */}
      <motion.div {...fade(0)} className="flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Visão geral da equipe</h2>
        <ChevronDown className="size-3.5 text-muted-foreground" />
        <span className="ml-2 flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-[10px] text-muted-foreground">
          Temporada 2024 <ChevronDown className="size-3" />
        </span>
        <button
          type="button"
          onClick={() => setFieldOpen("real")}
          className="hidden"
        >
          Visualização de Campo
        </button>
      </motion.div>
      <button
        type="button"
        onClick={() => setFieldOpen("real")}
        className="hidden"
      >
        Visualização de Campo
      </button>

      {/* metrics + donut */}
      <div className="mt-6 flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
          {teamMetrics.map((m, i) => (
            <motion.div key={m.label} variants={staggerItem} transition={{ ...spring, delay: 0.04 * i }} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MetricIcon type={m.icon} className="size-4 text-alert" />
                <span className="text-[10px] uppercase tracking-[0.14em]">{m.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight"><CountUp value={m.value} /></span>
                {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
              </div>
              <span className="flex items-center gap-1 text-[11px] text-good">
                <TrendingUp className="size-3" />
                {m.delta} <span className="text-muted-foreground">vs semana anterior</span>
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fade(0.2)} className="flex items-center gap-4">
          <DonutLoad
            segments={loadZones.map((z) => ({ pct: z.pct, token: z.token }))}
            centerValue="312"
            centerLabel="UA"
          />
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              Distribuição de carga
            </span>
            {loadZones.map((z) => (
              <div key={z.label} className="flex items-center gap-2 text-[11px]">
                <span className="size-2 rounded-full" style={{ backgroundColor: `var(--${z.token})` }} />
                <span className="w-28 text-muted-foreground">{z.label}</span>
                <span className="font-medium tabular-nums">{z.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* player strip */}
      <motion.div {...fade(0.25)} className="mt-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {athletes.map((a) => {
          const featured = a.id === "giroud"
          return (
            <motion.button
              key={a.id}
              onClick={() => onSelectAthlete(a.id)}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={spring}
              className={cn(
                "group relative flex w-32 shrink-0 flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-b from-surface to-card pt-2.5 text-center will-change-transform",
                featured && "ring-1 ring-foreground/30",
              )}
            >
              <div className="flex w-full items-center justify-between px-3 text-[10px] text-muted-foreground">
                <span className="font-bold text-foreground">{a.number}</span>
                <span>{a.positionShort}</span>
              </div>
              <div className="relative h-24 w-full">
                <Image src={a.photo || "/placeholder.svg"} alt={a.lastName} fill className="object-cover object-top" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="flex w-full flex-col gap-1 px-3 pb-3">
                <span className="text-xs font-semibold">{a.firstName[0]}. {a.lastName}</span>
                <span className="text-base font-bold leading-none">{a.distance} <span className="text-[10px] font-normal text-muted-foreground">km</span></span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Zona {a.zone}</span>
                <Bar pct={a.zone * 20} token={a.zoneState} />
              </div>
            </motion.button>
          )
        })}
        <motion.div
          variants={staggerItem}
          transition={spring}
          className="relative flex h-[198px] w-64 shrink-0 overflow-hidden rounded-2xl bg-card/35 text-left will-change-transform sm:w-72"
        >
          <button
            type="button"
            onClick={() => setFieldOpen("real")}
            className="absolute inset-0 text-left"
            aria-label="Abrir visualização de campo"
          >
            <Image
              src="/calendar-stadium-bg.png"
              alt="Arena Sicredi"
              fill
              sizes="288px"
              className="object-cover object-center opacity-55 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/30" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[8px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                Arena Sicredi
              </span>
              <h3 className="mt-1 text-sm font-semibold text-foreground">Visualização de Campo</h3>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-foreground/45">
                Real → 3D → Análise
              </span>
            </div>
          </button>
          <div className="absolute right-3 top-3 flex gap-1">
            {[
              ["real", "Real"],
              ["model", "3D"],
              ["analytics", "Plano"],
            ].map(([stage, label]) => (
              <button
                key={stage}
                type="button"
                onClick={() => setFieldOpen(stage as FieldStage)}
                className="rounded-full bg-background/60 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-foreground/55 backdrop-blur transition-colors hover:text-foreground"
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* analytics grid */}
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
        {/* team comparison */}
        <motion.div {...fade(0.1)}>
          <SectionLabel sub="médias">Comparativo da equipe</SectionLabel>
          <div className="flex flex-col gap-4">
            {teamComparison.map((c, i) => (
              <div key={c.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-medium text-good">{c.delta}</span>
                </div>
                <Bar pct={(c.now / c.max) * 100} token="good" delay={0.1 * i} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* accumulated load */}
        <motion.div {...fade(0.15)}>
          <SectionLabel sub="UA">Carga acumulada</SectionLabel>
          <LineChart now={accumulatedLoad.now} prev={accumulatedLoad.prev} days={accumulatedLoad.days} />
          <div className="mt-3 flex gap-4 text-[10px] uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-px w-4 bg-good" />Esta semana · 312 UA</span>
            <span className="flex items-center gap-1.5"><span className="h-px w-4 border-t border-dashed border-muted-foreground" />Anterior · 268 UA</span>
          </div>
        </motion.div>

        {/* position comparison */}
        <motion.div {...fade(0.2)}>
          <SectionLabel sub="distância">Comparativo por posição</SectionLabel>
          <div className="flex flex-col gap-4">
            {positionComparison.map((p, i) => (
              <div key={p.pos} className="flex items-center gap-3">
                <span className="w-12 text-xs font-semibold">{p.pos}</span>
                <Bar pct={(p.dist / p.max) * 100} token="good" delay={0.08 * i} />
                <span className="w-12 text-right text-xs tabular-nums">{p.dist} km</span>
                <span className="w-4 text-right text-[10px] text-muted-foreground">{p.athletes}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* thermography */}
        <motion.div {...fade(0.25)}>
          <SectionLabel>Termografia — comparativo</SectionLabel>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Image src="/thermography.png" alt="Termografia esta semana" width={160} height={120} className="h-32 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Esta semana</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <Image src="/thermography.png" alt="Média pessoal" width={160} height={120} className="h-32 w-auto object-contain" />
              <span className="text-[10px] text-muted-foreground">Média pessoal</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-wider text-muted-foreground">
            Baixa
            <span className="h-1.5 w-32 rounded-full" style={{ background: "linear-gradient(90deg, var(--info), var(--good), var(--warn), var(--alert))" }} />
            Alta
          </div>
        </motion.div>

        {/* internal ranking */}
        <motion.div {...fade(0.3)}>
          <SectionLabel sub="esta semana">Ranking interno</SectionLabel>
          <div className="flex flex-col gap-3">
            {internalRanking.map((r) => (
              <div key={r.pos} className="flex items-center gap-3">
                <span className="w-4 text-xs text-muted-foreground">{r.pos}</span>
                <span className="w-28 text-sm">{r.name}</span>
                <Bar pct={r.pct} token="good" />
                <span className="w-14 text-right text-xs tabular-nums">{r.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* alerts */}
        <motion.div {...fade(0.35)}>
          <SectionLabel sub="esta semana">Alertas</SectionLabel>
          <div className="flex flex-col gap-3">
            {weekAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: `var(--${a.state})` }} />
                <span className="text-muted-foreground">{a.text}</span>
              </div>
            ))}
            <button className="mt-2 self-start text-xs font-medium text-foreground underline-offset-4 hover:underline">
              Ver todos os alertas →
            </button>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {fieldOpen && <AthleticFieldExperience initialStage={fieldOpen} onClose={() => setFieldOpen(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}
