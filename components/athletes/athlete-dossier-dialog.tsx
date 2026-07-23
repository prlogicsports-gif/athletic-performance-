"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, Database, FileText, Flame, HeartPulse, MessageSquarePlus, X } from "lucide-react"
import { athletes, profilePhysical, profileRings } from "@/lib/data"
import { getAthleteDossier } from "@/lib/athlete-dossier-data"
import { DataSourceBadge } from "@/components/analytics/data-source-badge"
import { Bar, Ring } from "@/components/viz"
import { MetricIcon } from "@/components/metric-icon"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"

const tabs = ["visao geral", "padroes", "carga", "termografia", "observacoes", "historico", "fontes"] as const

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

        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <div className="flex flex-col justify-between gap-7">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">{dossier.availability}</span>
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">Responsavel: {dossier.responsible}</span>
                <span className="rounded-full bg-surface/70 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/55">Proxima avaliacao: {dossier.nextAssessment}</span>
              </div>

              <div className="mt-6 flex items-center gap-3 text-xs">
                <span className="text-3xl font-bold leading-none">{athlete.number}</span>
                <span className="uppercase tracking-[0.18em] text-foreground/45">{athlete.position}</span>
                <span>{athlete.country}</span>
              </div>

              <h2 className="mt-2 text-5xl font-extrabold leading-none tracking-tight md:text-6xl">
                {athlete.firstName} <span className="block md:inline">{athlete.lastName}</span>
              </h2>

              <div className="mt-8">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  Metricas fisicas atuais
                </h3>
                <div className="flex flex-wrap gap-x-8 gap-y-5">
                  {profilePhysical.map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-1">
                      <MetricIcon type={metric.icon} className="size-5 text-foreground" />
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-bold">{metric.value}</span>
                        {metric.unit && <span className="text-xs text-foreground/45">{metric.unit}</span>}
                      </div>
                      <span className="text-[10px] uppercase tracking-wide text-foreground/42">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
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

          <motion.div layoutId={`athlete-card-${athlete.id}`} className="relative flex min-h-[380px] items-start justify-center pr-16">
            <motion.div
              layoutId={`athlete-photo-${athlete.id}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="relative h-[390px] w-full max-w-sm"
            >
              <Image
                src={athlete.id === "giroud" ? "/athletes/hero-profile.png" : athlete.photo}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                fill
                sizes="380px"
                className="object-contain object-top opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-background/35" />
            </motion.div>

            <div className="absolute right-0 top-2 flex flex-col gap-4">
              {profileRings.map((ring, index) => (
                <motion.div
                  key={ring.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.08 * index }}
                  className="flex flex-col items-center gap-1"
                >
                  <Ring pct={ring.pct} token={ring.token} size={72} />
                  <span className="w-24 text-center text-[10px] uppercase tracking-wide text-foreground/45">
                    {ring.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </header>

        <main className="mt-8">
          {tab === "visao geral" && (
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Activity, label: "Carga recente", value: `${athlete.catapult.playerLoad} UA` },
                { icon: HeartPulse, label: "Recovery", value: `${athlete.apollo.recovery}%` },
                { icon: Flame, label: "Dor/fadiga", value: `${athlete.apollo.soreness}%` },
                { icon: Activity, label: "Ultima sessao", value: "Treino tatico" },
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

          {tab === "historico" && (
            <div className="grid gap-3 md:grid-cols-2">
              {[...dossier.alerts, ...dossier.decisions].map((item) => (
                <div key={item} className="rounded-2xl bg-card/16 p-4 text-sm text-foreground/62">{item}</div>
              ))}
            </div>
          )}

          {tab === "fontes" && (
            <div className="grid gap-3 md:grid-cols-2">
              {dossier.dataSources.map((source) => (
                <div key={source} className="flex items-center gap-3 rounded-2xl bg-card/16 p-4">
                  <Database className="size-4 text-foreground/45" />
                  <span className="font-semibold">{source}</span>
                  <span className="text-xs text-foreground/40">fonte importada em ambiente mock</span>
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
