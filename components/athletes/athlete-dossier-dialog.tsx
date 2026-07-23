"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, Database, FileText, Flame, HeartPulse, Map, MessageSquarePlus, X } from "lucide-react"
import { athletes, type Athlete } from "@/lib/data"
import { getAthleteDossier } from "@/lib/athlete-dossier-data"
import { DataSourceBadge } from "@/components/analytics/data-source-badge"
import { Bar } from "@/components/viz"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"

const tabs = ["visao geral", "padroes", "carga", "termografia", "observacoes", "campo", "historico", "fontes"] as const

function MiniField({ athlete }: { athlete: Athlete }) {
  const x = athlete.group === "atacantes" ? 72 : athlete.group === "meio-campistas" ? 52 : 32
  const y = athlete.number % 2 === 0 ? 42 : 58

  return (
    <div className="relative aspect-[105/68] overflow-hidden rounded-[22px] bg-[linear-gradient(90deg,rgba(22,80,42,0.34),rgba(13,45,27,0.24))]">
      <div className="absolute inset-[7%] border border-white/26" />
      <div className="absolute bottom-[7%] left-1/2 top-[7%] w-px bg-white/18" />
      <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16" />
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: 150,
          height: 95,
          background: "radial-gradient(circle, rgba(255,34,34,0.62), rgba(255,211,49,0.34), rgba(80,220,96,0.16), transparent 74%)",
        }}
      />
      <span
        className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        {athlete.number}
      </span>
    </div>
  )
}

export function AthleteDossierDialog({
  athleteId,
  onClose,
}: {
  athleteId: string
  onClose: () => void
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("visao geral")
  const athlete = athletes.find((item) => item.id === athleteId) ?? athletes[0]
  const dossier = getAthleteDossier(athlete.id)

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-background/84 px-3 pb-3 backdrop-blur-md md:items-center md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={`Dossie de ${athlete.firstName} ${athlete.lastName}`}
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-[#050505] p-5 text-foreground md:p-7"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-30 flex size-9 items-center justify-center rounded-full bg-surface/65 text-foreground/55 hover:text-foreground" aria-label="Fechar dossie">
          <X className="size-4" />
        </button>

        <header className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[26px] bg-card/20 p-5">
            <Image src={athlete.id === "giroud" ? "/athletes/hero-profile.png" : athlete.photo} alt={`${athlete.firstName} ${athlete.lastName}`} fill sizes="340px" className="object-cover object-top opacity-62" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/15" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/42">Dossie operacional</span>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-bold leading-none">{athlete.number}</span>
                <div>
                  <h2 className="text-3xl font-semibold leading-none">{athlete.firstName} {athlete.lastName}</h2>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-foreground/48">{athlete.position} - {dossier.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 pr-10">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">{dossier.availability}</span>
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">Responsavel: {dossier.responsible}</span>
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">Proxima avaliacao: {dossier.nextAssessment}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ["Altura", athlete.height],
                  ["Peso", athlete.weight],
                  ["Pe", dossier.dominantFoot],
                  ["Departamento", dossier.department],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    tab === item ? "bg-foreground text-background" : "bg-surface/65 text-foreground/45 hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-8">
          {tab === "visao geral" && (
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Activity, label: "Carga recente", value: `${athlete.catapult.playerLoad} UA` },
                { icon: HeartPulse, label: "Recovery", value: `${athlete.apollo.recovery}%` },
                { icon: Flame, label: "Dor/fadiga", value: `${athlete.apollo.soreness}%` },
                { icon: Map, label: "Ultima sessao", value: "Treino tatico" },
              ].map((item) => (
                <button key={item.label} type="button" className="rounded-2xl bg-card/16 p-4 text-left transition-colors hover:bg-card/28">
                  <item.icon className="size-4 text-foreground/55" />
                  <p className="mt-3 text-xl font-semibold">{item.value}</p>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "padroes" && (
            <div className="grid gap-4 md:grid-cols-3">
              {dossier.baselines.map((baseline) => (
                <div key={baseline.metric} className="rounded-2xl bg-card/16 p-4">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{baseline.metric}</span>
                  <p className="mt-2 text-2xl font-semibold">{baseline.average} {baseline.unit}</p>
                  <p className="mt-2 text-xs text-foreground/45">Faixa {baseline.lowerBound}-{baseline.upperBound} {baseline.unit} - melhor {baseline.bestValue} {baseline.unit}</p>
                  <Bar pct={Math.min(100, (athlete.catapult.playerLoad / baseline.upperBound) * 100)} className="mt-4" />
                </div>
              ))}
            </div>
          )}

          {tab === "carga" && (
            <div className="space-y-3">
              {dossier.loadHistory.map((record) => (
                <button key={record.id} type="button" className="flex w-full items-center justify-between gap-4 rounded-2xl bg-card/16 p-4 text-left transition-colors hover:bg-card/28">
                  <span>
                    <span className="block font-semibold">{record.session}</span>
                    <span className="text-xs text-foreground/40">{record.date} - planejado {record.planned} UA</span>
                  </span>
                  <span className="font-semibold">{record.executed} UA</span>
                  <DataSourceBadge provenance={record.source} compact />
                </button>
              ))}
            </div>
          )}

          {tab === "termografia" && (
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <Image src="/thermography.png" alt="Termografia" width={220} height={180} className="h-44 w-auto object-contain" />
              <div className="space-y-3">
                {dossier.thermographies.map((record) => (
                  <div key={record.id} className="rounded-2xl bg-card/16 p-4">
                    <p className="font-semibold">{record.bodyRegion}</p>
                    <p className="mt-1 text-sm text-foreground/55">Direito {record.rightValue} C - Esquerdo {record.leftValue} C - dif. {record.thermalDifference} C</p>
                    <p className="mt-2 text-xs text-foreground/42">{record.observation}</p>
                    <div className="mt-3"><DataSourceBadge provenance={record.source} compact /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "observacoes" && (
            <div className="space-y-3">
              <button type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/60 hover:text-foreground">
                <MessageSquarePlus className="size-3.5" />
                Adicionar observacao mockada
              </button>
              {dossier.observations.map((observation) => (
                <div key={observation.id} className="rounded-2xl bg-card/16 p-4">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{observation.category} - {observation.priority}</span>
                  <p className="mt-2 text-sm text-foreground/68">{observation.content}</p>
                  <p className="mt-2 text-xs text-foreground/38">Autor {observation.authorId} - visibilidade {observation.visibility}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "campo" && <MiniField athlete={athlete} />}

          {tab === "historico" && (
            <div className="grid gap-3 md:grid-cols-2">
              {[...dossier.alerts, ...dossier.decisions].map((item) => (
                <div key={item} className="rounded-2xl bg-card/16 p-4 text-sm text-foreground/62">{item}</div>
              ))}
            </div>
          )}

          {tab === "fontes" && (
            <div className="grid gap-3 md:grid-cols-2">
              {dossier.connectedSources.map((source) => (
                <div key={source} className="flex items-center gap-3 rounded-2xl bg-card/16 p-4">
                  <Database className="size-4 text-foreground/45" />
                  <span className="font-semibold">{source}</span>
                  <span className="text-xs text-foreground/40">conectado em ambiente mock</span>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-2xl bg-card/16 p-4">
                <FileText className="size-4 text-foreground/45" />
                <span className="text-sm text-foreground/60">Todos os dados desta tela estao marcados como demonstracao quando simulados.</span>
              </div>
            </div>
          )}
        </main>
      </motion.section>
    </motion.div>
  )
}
