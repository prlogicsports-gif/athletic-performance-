"use client"

import type { FieldLayer } from "@/lib/mock-field-session"

export function FieldLegends({ layers }: { layers: FieldLayer[] }) {
  const has = (layer: FieldLayer) => layers.includes(layer)

  return (
    <section className="grid gap-4 rounded-[22px] bg-card/10 p-4 text-[9px] uppercase tracking-[0.14em] text-foreground/45 md:grid-cols-4">
      <div className="flex items-center gap-3">
        <span>Heatmap</span>
        <span className="h-1.5 flex-1 min-w-24 rounded-full bg-[linear-gradient(90deg,rgba(33,155,255,0.6),rgba(80,220,96,0.8),rgba(255,211,49,0.9),rgba(255,34,34,0.95))]" />
        <span>Alta</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 opacity-70"><i className="h-px w-7 bg-info" /> corrida</span>
        <span className={`flex items-center gap-1.5 ${has("sprints") ? "" : "opacity-35"}`}><i className="h-px w-7 bg-alert" /> sprint</span>
        <span className={`flex items-center gap-1.5 ${has("routes") ? "" : "opacity-35"}`}><i className="h-px w-7 border-t border-dotted border-foreground/60" /> retorno</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`flex items-center gap-1.5 ${has("actions") ? "" : "opacity-35"}`}><i className="size-2 rounded-full border border-foreground/65" /> passe</span>
        <span className={`flex items-center gap-1.5 ${has("shots") ? "" : "opacity-35"}`}><i className="size-2 rotate-45 border border-foreground/65" /> finalizacao</span>
        <span className={`flex items-center gap-1.5 ${has("actions") ? "" : "opacity-35"}`}><i className="size-2 border border-foreground/65" /> recuperacao</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-good" /> Saudavel</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-warn" /> Monitorar</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-alert" /> DM</span>
      </div>
    </section>
  )
}
