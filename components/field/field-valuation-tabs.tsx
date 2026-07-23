"use client"

import { BarChart3, Flame, Footprints, Gauge, HeartPulse, Map, MousePointer2, Route, Zap } from "lucide-react"
import { type FieldLayer, type FieldPreset, type FieldValuation } from "@/lib/mock-field-session"
import { cn } from "@/lib/utils"

const icons = {
  overview: MousePointer2,
  movement: Map,
  load: BarChart3,
  sprints: Zap,
  speed: Gauge,
  distance: Route,
  accelerations: Footprints,
  heartRate: HeartPulse,
  actions: Flame,
}

export function FieldValuationTabs({
  valuation,
  valuations,
  onChange,
  onPreset,
  layers,
  onToggleLayer,
  onOpenDetails,
}: {
  valuation: FieldValuation
  valuations: Array<{ id: FieldValuation; label: string; description: string }>
  onChange: (valuation: FieldValuation) => void
  onPreset: (preset: FieldPreset) => void
  layers: FieldLayer[]
  onToggleLayer: (layer: FieldLayer) => void
  onOpenDetails: () => void
}) {
  const presetTabs: Array<{ id: FieldValuation; label: string; preset: FieldPreset }> = [
    { id: "overview", label: "Geral", preset: "clear" },
    { id: "movement", label: "Movimentacao", preset: "movement" },
    { id: "sprints", label: "Sprint", preset: "sprints" },
    { id: "load", label: "Carga", preset: "load" },
    { id: "heartRate", label: "FC", preset: "load" },
    { id: "actions", label: "Acoes", preset: "actions" },
  ]
  const layerChips: Array<{ id: FieldLayer; label: string }> = [
    { id: "heatmap", label: "Heatmap" },
    { id: "routes", label: "Rota" },
    { id: "sprints", label: "Sprint" },
    { id: "actions", label: "Acoes" },
    { id: "shots", label: "Finalizacoes" },
    { id: "accelerations", label: "Aceleracoes" },
  ]

  return (
    <section className="space-y-3">
      <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
        {presetTabs.map((item) => {
          const valuationItem = valuations.find((candidate) => candidate.id === item.id)
          const Icon = icons[item.id]
          return (
            <button
              key={item.id}
              type="button"
              title={valuationItem?.description}
              onClick={() => {
                onChange(item.id)
                onPreset(item.preset)
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors",
                valuation === item.id ? "bg-foreground text-background" : "bg-surface/70 text-foreground/45 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
          {layerChips.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => onToggleLayer(layer.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors",
                layers.includes(layer.id) ? "bg-surface/80 text-foreground/80" : "bg-background/55 text-foreground/32 hover:text-foreground",
              )}
            >
              {layers.includes(layer.id) ? "✓ " : ""}
              {layer.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          className="rounded-full bg-surface/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
        >
          Abrir detalhes
        </button>
      </div>
    </section>
  )
}
