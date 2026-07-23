"use client"

import { BarChart3, Flame, Footprints, Gauge, HeartPulse, Map, MousePointer2, Route, Zap } from "lucide-react"
import { fieldPresets, type FieldPreset, type FieldValuation } from "@/lib/mock-field-session"
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
  onOpenDetails,
}: {
  valuation: FieldValuation
  valuations: Array<{ id: FieldValuation; label: string; description: string }>
  onChange: (valuation: FieldValuation) => void
  onPreset: (preset: FieldPreset) => void
  onOpenDetails: () => void
}) {
  return (
    <section className="space-y-3">
      <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
        {valuations.map((item) => {
          const Icon = icons[item.id]
          return (
            <button
              key={item.id}
              type="button"
              title={item.description}
              onClick={() => onChange(item.id)}
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
          {fieldPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPreset(preset.id)}
              className="shrink-0 rounded-full bg-background/55 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/45 transition-colors hover:text-foreground"
            >
              {preset.label}
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
