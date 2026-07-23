"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, AlertTriangle, CheckCircle2, Clock3, FileText, Radio, Settings2, TrendingDown, X } from "lucide-react"
import { athletes, teamMetricsPlaceholders } from "@/lib/data"
import { decisionItems, syncStatus, type DecisionSeverity } from "@/lib/platform-settings"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { usePlatformSettings } from "@/hooks/use-platform-settings"

const severityStyle: Record<DecisionSeverity, { dot: string; label: string; text: string }> = {
  critico: { dot: "bg-alert", label: "Critico", text: "text-alert" },
  atencao: { dot: "bg-warn", label: "Atencao", text: "text-warn" },
  informativo: { dot: "bg-info", label: "Info", text: "text-info" },
}

type BriefDetail = "attention" | "unavailable" | "review" | "reports" | "sync" | "queue"

function BriefMetric({
  icon: Icon,
  label,
  value,
  tone = "text-foreground",
  onClick,
}: {
  icon: typeof AlertTriangle
  label: string
  value: string
  tone?: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={staggerItem}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={spring}
      className="group min-w-0 text-left"
    >
      <div className="flex items-center gap-2 text-foreground/42 transition-colors group-hover:text-foreground/75">
        <Icon className="size-3.5" strokeWidth={1.5} />
        <span className="truncate text-[10px] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <span className={cn("mt-2 block text-3xl font-bold leading-none md:text-4xl", tone)}>{value}</span>
      <span className="mt-3 block h-2 w-full max-w-36 rounded-full bg-white/[0.05]">
        <span className="block h-full w-2/3 rounded-full bg-foreground/12 transition-colors group-hover:bg-foreground/28" />
      </span>
    </motion.button>
  )
}

export function MorningBriefScreen({
  onOpenDashboard,
  onOpenSettings,
  onSelectAthlete,
}: {
  onOpenDashboard: () => void
  onOpenSettings: () => void
  onSelectAthlete: (id: string) => void
}) {
  const [detail, setDetail] = useState<BriefDetail | null>(null)
  const { settings } = usePlatformSettings()
  const unavailable = athletes.filter((athlete) => athlete.zoneState === "alert")
  const monitor = athletes.filter((athlete) => athlete.zoneState === "warn")
  const priorityAthletes = decisionItems
    .map((decision) => ({
      decision,
      athlete: athletes.find((athlete) => athlete.id === decision.athleteId),
    }))
    .filter((item) => item.athlete)

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="px-4 pb-16 pt-1 md:px-8"
    >
      <motion.div variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/45">
            Morning Brief
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
            Bom dia, comissao.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
            Hoje existem sinais que precisam de decisao antes da sessao principal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={onOpenSettings}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={spring}
            className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground"
          >
            <Settings2 className="size-4" strokeWidth={1.5} />
            Features
          </motion.button>
          <motion.button
            type="button"
            onClick={onOpenDashboard}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={spring}
            className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground"
          >
            Abrir dashboard completo
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="mt-9 grid grid-cols-2 gap-6 md:grid-cols-4">
        <BriefMetric icon={AlertTriangle} label="Atletas em atencao" value={`${monitor.length + unavailable.length}`} tone="text-warn" onClick={() => setDetail("attention")} />
        <BriefMetric icon={TrendingDown} label="Indisponiveis" value={`${unavailable.length}`} tone="text-alert" onClick={() => setDetail("unavailable")} />
        <BriefMetric icon={Clock3} label="Sessao em revisao" value="1" onClick={() => setDetail("review")} />
        <BriefMetric icon={FileText} label="Relatorios publicados" value="3" onClick={() => setDetail("reports")} />
      </motion.div>

      <motion.section variants={staggerItem} className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
        <div>
          <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">
            Decision Center
          </span>
          <h3 className="mt-2 max-w-2xl text-xl font-semibold leading-tight md:text-2xl">
            {settings.decisionCenterEnabled ? "Prioridades prontas para revisao." : "Decision Center pausado."}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
            Os detalhes ficam sob demanda para manter a abertura limpa e rapida para a comissao.
          </p>
        </div>

        <div className="grid gap-2">
          <button type="button" onClick={() => setDetail("attention")} className="flex items-center justify-between gap-4 rounded-full bg-white/[0.045] px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/65 hover:text-foreground">
            Quem exige atencao
            <span>{decisionItems.length}</span>
          </button>
          <button type="button" onClick={() => setDetail("sync")} className="flex items-center justify-between gap-4 rounded-full bg-white/[0.045] px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/65 hover:text-foreground">
            Sincronizacao
            <Radio className="size-3.5 text-alert" />
          </button>
          <button type="button" onClick={() => setDetail("queue")} className="flex items-center justify-between gap-4 rounded-full bg-white/[0.045] px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/65 hover:text-foreground">
            Fila do dia
            <Activity className="size-3.5 text-good" />
          </button>
        </div>
      </motion.section>

      <AnimatePresence>
        {detail && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-background/82 px-3 pb-3 backdrop-blur-md md:items-center md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              className="relative max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-[#050505] p-5 text-foreground ring-1 ring-white/[0.07] md:p-7"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={spring}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setDetail(null)} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/[0.06] text-foreground/55 hover:text-foreground" aria-label="Fechar briefing">
                <X className="size-4" />
              </button>

              <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">
                Morning Brief
              </span>
              <h3 className="mt-2 pr-10 text-2xl font-semibold">
                {detail === "attention" && "Atletas em atencao"}
                {detail === "unavailable" && "Indisponiveis"}
                {detail === "review" && "Sessao em revisao"}
                {detail === "reports" && "Relatorios publicados"}
                {detail === "sync" && "Sincronizacao"}
                {detail === "queue" && "Fila do dia"}
              </h3>

              {detail === "attention" && (
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {priorityAthletes.map(({ athlete, decision }, index) => {
                    if (!athlete) return null
                    const severity = severityStyle[decision.severity]
                    return (
                      <motion.button
                        key={decision.id}
                        type="button"
                        onClick={() => onSelectAthlete(athlete.id)}
                        whileHover={{ y: -6, scale: 1.015 }}
                        transition={{ ...spring, delay: index * 0.03 }}
                        className="group relative min-h-[250px] overflow-hidden rounded-2xl bg-card/30 p-4 text-left"
                      >
                        <Image src={athlete.photo} alt={`${athlete.firstName} ${athlete.lastName}`} fill sizes="320px" className="object-cover object-top opacity-35 transition duration-700 group-hover:scale-105 group-hover:opacity-45" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                          <div>
                            <span className={cn("inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em]", severity.text)}>
                              <span className={cn("size-2 rounded-full", severity.dot)} />
                              {severity.label}
                            </span>
                            <h4 className="mt-4 text-3xl font-semibold leading-none">{athlete.number}</h4>
                            <p className="mt-1 text-sm font-semibold">{athlete.firstName[0]}. {athlete.lastName}</p>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">{athlete.positionShort}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{decision.signal}</p>
                            <p className="mt-2 text-xs leading-relaxed text-foreground/52">{decision.summary}</p>
                            <p className="mt-3 text-sm font-semibold">{decision.suggestedAction}</p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {detail === "unavailable" && (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {unavailable.length ? unavailable.map((athlete) => (
                    <button key={athlete.id} type="button" onClick={() => onSelectAthlete(athlete.id)} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.045] p-4 text-left">
                      <span className="font-semibold">{athlete.number} {athlete.firstName[0]}. {athlete.lastName}</span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-alert">monitorar</span>
                    </button>
                  )) : <p className="text-sm text-foreground/55">Nenhum atleta indisponivel no mock atual.</p>}
                </div>
              )}

              {detail === "review" && (
                <div className="mt-6 space-y-3 text-sm text-foreground/65">
                  <p>Treino tatico - Campo A aguardando revisao de carga e sincronizacao final.</p>
                  <p>Responsavel: Preparacao fisica. Fonte: Catapult + Apollo.</p>
                </div>
              )}

              {detail === "reports" && (
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {["Relatorio semanal", "Carga por atleta", "Resumo fisiologia"].map((report) => (
                    <div key={report} className="rounded-2xl bg-white/[0.045] p-4">
                      <p className="font-semibold">{report}</p>
                      <p className="mt-2 text-xs text-foreground/45">Publicado em ambiente mock.</p>
                    </div>
                  ))}
                </div>
              )}

              {detail === "sync" && (
                <div className="mt-6 space-y-4">
                  {syncStatus.map((item) => (
                    <div key={item.source} className="flex items-center justify-between gap-4 text-sm">
                      <span>
                        <span className="block font-semibold">{item.source}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Ultima sincronizacao {item.time}</span>
                      </span>
                      <span className="font-mono text-xs text-good">{item.quality}%</span>
                    </div>
                  ))}
                </div>
              )}

              {detail === "queue" && (
                <div className="mt-6 space-y-3">
                  {["Validar sessao Catapult", "Revisar atleta em carga alta", "Publicar relatorio semanal"].map((task) => (
                    <div key={task} className="flex items-center gap-3 text-sm text-foreground/65">
                      <CheckCircle2 className="size-4 text-good" strokeWidth={1.5} />
                      <span>{task}</span>
                    </div>
                  ))}
                  <div className="pt-4">
                    <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">Estado da equipe</span>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <p><strong className="block text-2xl">{teamMetricsPlaceholders.averages.playerLoad}</strong><span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Player Load medio</span></p>
                      <p><strong className="block text-2xl">{teamMetricsPlaceholders.averages.recovery}%</strong><span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Recovery medio</span></p>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
