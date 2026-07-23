"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Copy, FileText, Play, Plus, Radio, Upload } from "lucide-react"
import { athleticSessions, getSessionResponsible, type AthleticSession } from "@/lib/session-data"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { DataSourceBadge } from "@/components/analytics/data-source-badge"
import { CreateSessionWizard } from "@/components/sessions/create-session-wizard"
import { LiveCaptureDialog } from "@/components/sessions/live-capture-dialog"
import { cn } from "@/lib/utils"

const statusStyle: Record<AthleticSession["status"], string> = {
  draft: "text-foreground/40",
  scheduled: "text-info",
  ready: "text-good",
  live: "text-alert",
  review: "text-warn",
  published: "text-good",
  archived: "text-foreground/35",
}

export function SessionsScreen({ onOpenLive }: { onOpenLive: () => void }) {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [captureSession, setCaptureSession] = useState<AthleticSession | null>(null)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="px-4 pb-16 pt-1 md:px-8">
      <motion.div variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/45">Sessoes</span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">Origem, qualidade e revisao</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
            Treinos e jogos conectados a Catapult, Apollo, manual, CSV e mock ao vivo.
          </p>
        </div>
        <button type="button" onClick={() => setWizardOpen(true)} className="flex items-center gap-2 self-start rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-background md:self-auto">
          <Plus className="size-4" />
          Nova sessao
        </button>
      </motion.div>

      <motion.div variants={staggerContainer} className="mt-8 grid gap-4">
        {athleticSessions.map((session) => {
          const responsible = getSessionResponsible(session)
          return (
            <motion.section key={session.id} variants={staggerItem} className="rounded-[26px] bg-card/14 p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-[9px] font-semibold uppercase tracking-[0.2em]", statusStyle[session.status])}>{session.status}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">{session.type}</span>
                    <DataSourceBadge provenance={session.provenance} compact />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{session.name}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-foreground/52">{session.objective}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.16em] text-foreground/42">
                    <span>{session.date} - {session.time}</span>
                    <span>{session.location} - {session.field}</span>
                    <span>Responsavel {responsible.name}</span>
                    <span>Qualidade {session.quality}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setCaptureSession(session)} className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
                    <Radio className="size-3.5" /> Captacao
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
                    <Copy className="size-3.5" /> Duplicar
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
                    <Upload className="size-3.5" /> Exportar
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
                    <FileText className="size-3.5" /> Relatorio
                  </button>
                  {session.status === "live" && (
                    <button type="button" onClick={onOpenLive} className="flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-background">
                      <Play className="size-3.5" /> Ao vivo
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {session.blocks.map((block) => (
                  <button key={block.id} type="button" className="rounded-2xl bg-card/16 p-4 text-left transition-colors hover:bg-card/28">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{block.duration} min - {block.plannedLoad} UA</span>
                    <p className="mt-2 font-semibold">{block.name}</p>
                    <p className="mt-1 text-xs text-foreground/45">{block.objective}</p>
                  </button>
                ))}
              </div>
            </motion.section>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {wizardOpen && <CreateSessionWizard onClose={() => setWizardOpen(false)} />}
        {captureSession && <LiveCaptureDialog session={captureSession} onClose={() => setCaptureSession(null)} onStart={() => { setCaptureSession(null); onOpenLive() }} />}
      </AnimatePresence>
    </motion.div>
  )
}
