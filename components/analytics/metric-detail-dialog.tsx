"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { MetricAnalysis } from "@/lib/analytics-data"
import { spring } from "@/lib/motion"
import { DataSourceBadge } from "./data-source-badge"

export function MetricDetailDialog({
  analysis,
  onClose,
}: {
  analysis: MetricAnalysis
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-background/82 px-3 pb-3 backdrop-blur-md md:items-center md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={analysis.title}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-[#050505] p-5 text-foreground md:p-7"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-surface/65 text-foreground/55 transition-colors hover:text-foreground"
          aria-label="Fechar analise"
        >
          <X className="size-4" />
        </button>

        <div className="pr-12">
          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/35">
            Analise aprofundada - {analysis.scope}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">{analysis.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/55">{analysis.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <DataSourceBadge provenance={analysis.provenance} />
            <span className="rounded-full bg-surface/55 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/45">
              Ambiente de demonstracao
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Historico</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {analysis.history.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-card/18 p-4">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{item.label}</span>
                    <p className="mt-2 text-xl font-semibold">{item.value}</p>
                    {item.note && <p className="mt-2 text-xs text-foreground/45">{item.note}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Comparacoes</h3>
              <div className="mt-3 space-y-3">
                {analysis.comparisons.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-foreground/55">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                    {item.delta && <span className="text-xs text-good">{item.delta}</span>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Sessoes</h3>
              <div className="mt-3 space-y-3">
                {analysis.sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 rounded-2xl bg-card/16 p-3 text-left text-sm transition-colors hover:bg-card/28"
                  >
                    <span>
                      <span className="block font-semibold">{session.name}</span>
                      <span className="text-xs text-foreground/40">{session.date}</span>
                    </span>
                    <span className="font-semibold">{session.value}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Origem do dado</h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-4"><dt className="text-foreground/40">Sistema</dt><dd>{analysis.provenance.sourceLabel}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-foreground/40">Capturado</dt><dd>{analysis.provenance.collectedAt}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-foreground/40">Registrado</dt><dd>{analysis.provenance.registeredAt}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-foreground/40">Atualizado</dt><dd>{analysis.provenance.updatedAt}</dd></div>
                {analysis.provenance.externalRecordId && (
                  <div className="flex justify-between gap-4"><dt className="text-foreground/40">Registro</dt><dd>{analysis.provenance.externalRecordId}</dd></div>
                )}
              </dl>
            </section>

            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Observacoes</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/60">
                {analysis.observations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Alertas e decisoes</h3>
              <div className="mt-3 space-y-3 text-sm">
                {analysis.alerts.map((item) => <p key={item} className="text-warn">{item}</p>)}
                {analysis.decisions.map((item) => <p key={item} className="text-foreground/65">{item}</p>)}
              </div>
            </section>
          </aside>
        </div>
      </motion.section>
    </motion.div>
  )
}
