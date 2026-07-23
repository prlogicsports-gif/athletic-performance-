"use client"

import type { FieldLayer } from "@/lib/mock-field-session"

export function FieldLegends({ layers }: { layers: FieldLayer[] }) {
  const has = (layer: FieldLayer) => layers.includes(layer)

  return (
    <section className="grid gap-3 text-[9px] uppercase tracking-[0.14em] text-foreground/45 md:grid-cols-3">
      {has("heatmap") && (
        <div className="flex items-center gap-3">
          <span>Heatmap</span>
          <span className="h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,rgba(33,155,255,0.6),rgba(80,220,96,0.8),rgba(255,211,49,0.9),rgba(255,34,34,0.95))]" />
          <span>Alta</span>
        </div>
      )}
      {(has("routes") || has("sprints")) && (
        <div className="flex flex-wrap items-center gap-3">
          {has("routes") && <span className="flex items-center gap-1.5"><i className="h-px w-6 bg-info" /> Rota</span>}
          {has("sprints") && <span className="flex items-center gap-1.5"><i className="h-px w-6 bg-alert" /> Sprint</span>}
        </div>
      )}
      {(has("shots") || has("actions") || has("accelerations") || has("decelerations")) && (
        <div className="flex flex-wrap items-center gap-3">
          {has("shots") && <span>Finalizacoes: gol / defesa / fora</span>}
          {has("actions") && <span>Acoes: simbolos por evento</span>}
          {has("accelerations") && <span className="text-good">Aceleracoes</span>}
          {has("decelerations") && <span className="text-warn">Desaceleracoes</span>}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-good" /> Online</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-warn" /> Monitorar</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-alert" /> Sem sinal</span>
      </div>
    </section>
  )
}
