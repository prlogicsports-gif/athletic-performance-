"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Battery, Radio, X } from "lucide-react"
import { athletes } from "@/lib/data"
import { deviceAssignments, getSessionReadiness, type AthleticSession } from "@/lib/session-data"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function LiveCaptureDialog({
  session,
  onClose,
  onStart,
}: {
  session: AthleticSession
  onClose: () => void
  onStart: () => void
}) {
  const readiness = getSessionReadiness()

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/84 px-3 pb-3 backdrop-blur-md md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="Iniciar captacao ao vivo"
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-[#050505] p-5 text-foreground md:p-7"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-surface/65 text-foreground/55 hover:text-foreground" aria-label="Fechar captacao">
          <X className="size-4" />
        </button>

        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/35">Preparacao da captacao</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Iniciar captacao ao vivo</h2>
        <p className="mt-2 text-sm text-foreground/52">{session.name} - {session.field} - {session.sources.join(" / ")}</p>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ["Sem dispositivo", readiness.missingDevices, "alert"],
            ["Restricoes ativas", readiness.restrictions, "warn"],
            ["Pre-treino pendente", readiness.pendingPreTraining, "warn"],
            ["Qualidade", `${session.quality}%`, "good"],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-2xl bg-card/16 p-4">
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
              <p className={cn("mt-2 text-3xl font-semibold", tone === "alert" ? "text-alert" : tone === "warn" ? "text-warn" : "text-good")}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {deviceAssignments.map((assignment) => {
            const athlete = athletes.find((item) => item.id === assignment.athleteId) ?? athletes[0]
            return (
              <div key={assignment.athleteId} className="rounded-2xl bg-card/16 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{athlete.firstName[0]}. {athlete.lastName}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-foreground/40">{athlete.positionShort} - meta {assignment.targetPct}%</p>
                  </div>
                  <span className={cn("text-[9px] font-semibold uppercase tracking-[0.16em]", assignment.status === "missing" ? "text-alert" : assignment.status === "unstable" ? "text-warn" : "text-good")}>
                    {assignment.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-foreground/55">
                  <span className="flex items-center gap-1.5"><Radio className="size-3.5" /> {assignment.connectionQuality}%</span>
                  <span className="flex items-center gap-1.5"><Battery className="size-3.5" /> {assignment.battery ?? "--"}%</span>
                  <span>{assignment.preTraining}</span>
                </div>
                {assignment.restriction && <p className="mt-3 flex gap-2 text-xs text-warn"><AlertTriangle className="size-3.5 shrink-0" /> {assignment.restriction}</p>}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-foreground/52">
            {readiness.missingDevices || readiness.restrictions || readiness.pendingPreTraining
              ? `${readiness.missingDevices} atletas sem dispositivo. ${readiness.restrictions} restricoes ativas. ${readiness.pendingPreTraining} pre-treinos pendentes.`
              : "Todos os atletas estao prontos para iniciar."}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-full bg-surface/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/55 hover:text-foreground">
              Cancelar
            </button>
            <button type="button" onClick={onStart} className="rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
              Iniciar com pendencias
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
