"use client"

import { motion } from "framer-motion"
import { Database, FileText, GitMerge, Upload, X } from "lucide-react"
import { getAthleteName, parsedExternalRecords, readingLog, sourceSummaries } from "@/lib/external-reports"
import { getSessionImportReadiness, type AthleticSession } from "@/lib/session-data"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function ImportReportDialog({
  session,
  onClose,
  onStart,
}: {
  session: AthleticSession
  onClose: () => void
  onStart: () => void
}) {
  const readiness = getSessionImportReadiness()

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/84 px-3 pb-3 backdrop-blur-md md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="Importar relatorios externos"
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-[#101010]/92 p-5 text-foreground ring-1 ring-white/[0.08] backdrop-blur-2xl md:p-7"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/[0.06] text-foreground/55 hover:text-foreground" aria-label="Fechar importacao">
          <X className="size-4" />
        </button>

        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/35">Fontes e importacoes</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Ler e interpretar relatorios externos</h2>
        <p className="mt-2 max-w-3xl text-sm text-foreground/52">
          {session.name} - Catapult e Apollo entram como arquivos e resumos ja processados, preservando origem e regras de interpretacao.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ["Catapult", readiness.catapultReports, "relatorios"],
            ["Apollo", readiness.apolloReports, "relatorios"],
            ["Pendencias", readiness.pendingRecords, "registros"],
            ["Conflitos", readiness.conflicts, "revisao"],
          ].map(([label, value, sub]) => (
            <div key={label} className="rounded-2xl bg-white/[0.055] p-4">
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
              <p className={cn("mt-2 text-3xl font-semibold", label === "Conflitos" ? "text-warn" : "text-foreground")}>{value}</p>
              <p className="mt-1 text-xs text-foreground/42">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {(["catapult", "apollo"] as const).map((source) => {
            const item = sourceSummaries[source]
            return (
              <section key={source} className="rounded-[26px] bg-white/[0.045] p-5 ring-1 ring-white/[0.06]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/40">{item.status}</span>
                    <h3 className="mt-2 text-2xl font-semibold">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/52">{item.description}</p>
                  </div>
                  <Database className="size-5 text-foreground/55" strokeWidth={1.5} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <span><strong className="block">{item.reports}</strong><span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">relatorios</span></span>
                  <span><strong className="block">{item.athletes}</strong><span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">atletas</span></span>
                  <span><strong className="block">{item.metrics}</strong><span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">metricas</span></span>
                  <span><strong className="block">{item.pending}</strong><span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">pendencias</span></span>
                </div>
                <p className="mt-5 text-xs text-foreground/45">Ultima leitura: {item.lastRead}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/65 hover:text-foreground">
                    <FileText className="size-3.5" /> Abrir {item.label}
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-background">
                    <Upload className="size-3.5" /> Importar relatorio
                  </button>
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Dados interpretados</h3>
            <div className="mt-4 space-y-3">
              {parsedExternalRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="rounded-2xl bg-white/[0.045] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold">{record.originalField} {"->"} {record.normalizedField}</span>
                      <span className="text-xs text-foreground/45">{getAthleteName(record.athleteId)} - {record.recordedAt}</span>
                    </span>
                    <span className={cn("text-[9px] font-semibold uppercase tracking-[0.16em]", record.status === "valid" ? "text-good" : "text-warn")}>{record.status}</span>
                  </div>
                  <p className="mt-3 text-xs text-foreground/55">Valor: {record.originalValue} {record.originalUnit ?? ""} {"->"} {record.normalizedValue} {record.normalizedUnit ?? ""}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/35">Regra: {record.interpretationRule}</p>
                </div>
              ))}
            </div>
          </section>

          <aside>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Log de leitura</h3>
            <div className="mt-4 space-y-2">
              {readingLog.map((item) => (
                <p key={item} className="rounded-2xl bg-white/[0.045] px-3 py-2 text-xs text-foreground/58">{item}</p>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-foreground/52">
            A plataforma le relatorios, identifica atletas e cruza Catapult + Apollo para gerar um relatorio operacional unificado.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-full bg-white/[0.07] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/55 hover:text-foreground">
              Cancelar
            </button>
            <button type="button" onClick={onStart} className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
              <GitMerge className="size-3.5" />
              Criar relatorio unificado
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
