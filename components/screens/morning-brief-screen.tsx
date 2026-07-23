"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Activity, AlertTriangle, CheckCircle2, Clock3, FileText, Radio, Settings2, TrendingDown } from "lucide-react"
import { athletes, teamMetricsPlaceholders } from "@/lib/data"
import { decisionItems, syncStatus, type DecisionSeverity } from "@/lib/platform-settings"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { usePlatformSettings } from "@/hooks/use-platform-settings"
import { ClickableMetricCard } from "@/components/analytics/clickable-metric-card"

const severityStyle: Record<DecisionSeverity, { dot: string; label: string; text: string }> = {
  critico: { dot: "bg-alert", label: "Critico", text: "text-alert" },
  atencao: { dot: "bg-warn", label: "Atencao", text: "text-warn" },
  informativo: { dot: "bg-info", label: "Info", text: "text-info" },
}

function BriefMetric({
  icon: Icon,
  label,
  value,
  analysisId = "load",
  tone = "text-foreground",
}: {
  icon: typeof AlertTriangle
  label: string
  value: string
  analysisId?: string
  tone?: string
}) {
  return (
    <motion.div variants={staggerItem} className="min-w-0">
      <ClickableMetricCard
        analysisId={analysisId}
        icon={<Icon className="size-3.5" strokeWidth={1.5} />}
        label={label}
        value={value}
        tone={cn("text-3xl md:text-4xl", tone)}
      />
    </motion.div>
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
        <BriefMetric icon={AlertTriangle} label="Atletas em atencao" value={`${monitor.length + unavailable.length}`} analysisId="load" tone="text-warn" />
        <BriefMetric icon={TrendingDown} label="Indisponiveis" value={`${unavailable.length}`} analysisId="thermography" tone="text-alert" />
        <BriefMetric icon={Clock3} label="Sessao em revisao" value="1" analysisId="time" />
        <BriefMetric icon={FileText} label="Relatorios publicados" value="3" analysisId="load" />
      </motion.div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {settings.decisionCenterEnabled ? (
        <motion.section variants={staggerItem}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">
                Decision Center
              </span>
              <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.16em]">
                Quem exige atencao hoje?
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/35">
              {decisionItems.length} decisoes
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {priorityAthletes.map(({ athlete, decision }, index) => {
              if (!athlete) return null
              const severity = severityStyle[decision.severity]

              return (
                <motion.button
                  key={decision.id}
                  type="button"
                  onClick={() => onSelectAthlete(athlete.id)}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ ...spring, delay: index * 0.03 }}
                  className="group relative min-h-[270px] overflow-hidden rounded-2xl bg-card/30 p-4 text-left"
                >
                  <Image
                    src={athlete.photo}
                    alt={`${athlete.firstName} ${athlete.lastName}`}
                    fill
                    sizes="340px"
                    className="object-cover object-top opacity-35 transition duration-700 group-hover:scale-105 group-hover:opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 rounded-full", severity.dot)} />
                          <span className={cn("text-[9px] font-semibold uppercase tracking-[0.2em]", severity.text)}>
                            {severity.label}
                          </span>
                        </div>
                        <h4 className="mt-4 text-3xl font-semibold leading-none">{athlete.number}</h4>
                        <p className="mt-1 text-sm font-semibold">
                          {athlete.firstName[0]}. {athlete.lastName}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                          {athlete.positionShort}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                        {decision.status.replace("_", " ")}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-foreground">{decision.signal}</p>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/52">{decision.summary}</p>
                      <div className="mt-4">
                        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/35">
                          Acao sugerida
                        </span>
                        <p className="mt-1 text-sm font-semibold text-foreground">{decision.suggestedAction}</p>
                      </div>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                        Responsavel: {decision.owner}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.section>
        ) : (
          <motion.section variants={staggerItem} className="flex min-h-[280px] items-center justify-center text-center">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/35">
                Decision Center pausado
              </span>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/50">
                Reative em Features para mostrar prioridades, acoes sugeridas e responsaveis.
              </p>
            </div>
          </motion.section>
        )}

        <motion.aside variants={staggerItem} className="space-y-8">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Radio className="size-4 text-alert" strokeWidth={1.5} />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">Sincronizacao</h3>
            </div>
            <div className="space-y-4">
              {syncStatus.map((item) => (
                <div key={item.source} className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold">{item.source}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                      Ultima sincronizacao {item.time}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-good">{item.quality}%</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Activity className="size-4 text-foreground/55" strokeWidth={1.5} />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">Fila do dia</h3>
            </div>
            <div className="space-y-3">
              {["Validar sessao Catapult", "Revisar atleta em carga alta", "Publicar relatorio semanal"].map((task) => (
                <div key={task} className="flex items-center gap-3 text-sm text-foreground/65">
                  <CheckCircle2 className="size-4 text-good" strokeWidth={1.5} />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">
              Estado da equipe
            </span>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold">{teamMetricsPlaceholders.averages.playerLoad}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Player Load medio</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{teamMetricsPlaceholders.averages.recovery}%</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">Recovery medio</p>
              </div>
            </div>
          </section>
        </motion.aside>
      </div>
    </motion.div>
  )
}
