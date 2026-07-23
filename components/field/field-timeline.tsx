"use client"

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react"
import { type FieldTimelineEvent } from "@/lib/mock-field-session"
import { cn } from "@/lib/utils"

export function FieldTimeline({
  minute,
  playing,
  followingLive,
  events,
  onMinuteChange,
  onPlayingChange,
  onReturnToLive,
}: {
  minute: number
  playing: boolean
  followingLive: boolean
  events: FieldTimelineEvent[]
  onMinuteChange: (minute: number) => void
  onPlayingChange: (playing: boolean) => void
  onReturnToLive: () => void
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" className="flex size-8 items-center justify-center rounded-full bg-surface text-foreground/60 hover:text-foreground" onClick={() => onMinuteChange(Math.max(0, minute - 3))} aria-label="Voltar">
            <SkipBack className="size-3.5" />
          </button>
          <button type="button" className="flex size-9 items-center justify-center rounded-full bg-foreground text-background" onClick={() => onPlayingChange(!playing)} aria-label={playing ? "Pausar" : "Reproduzir"}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button type="button" className="flex size-8 items-center justify-center rounded-full bg-surface text-foreground/60 hover:text-foreground" onClick={() => onMinuteChange(Math.min(64, minute + 3))} aria-label="Avancar">
            <SkipForward className="size-3.5" />
          </button>
        </div>
        {!followingLive && (
          <button type="button" onClick={onReturnToLive} className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
            <RotateCcw className="size-3.5" />
            Voltar ao tempo atual
          </button>
        )}
      </div>
      <div className="relative py-5">
        <input
          type="range"
          min={0}
          max={64}
          value={minute}
          onChange={(event) => onMinuteChange(Number(event.target.value))}
          className="w-full accent-white"
          aria-label="Timeline da sessao"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8">
          {events.map((event) => (
            <span
              key={event.id}
              className={cn(
                "absolute top-2 size-2 -translate-x-1/2 rounded-full",
                event.type === "alert" ? "bg-alert" : event.type === "signal" ? "bg-warn" : event.type === "decision" ? "bg-info" : "bg-foreground/45",
              )}
              style={{ left: `${(event.minute / 64) * 100}%` }}
              title={event.label}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.14em] text-foreground/40">
        <span>{minute}:00</span>
        {events.filter((event) => Math.abs(event.minute - minute) <= 6).map((event) => (
          <span key={event.id}>{event.label}</span>
        ))}
      </div>
    </section>
  )
}
