"use client"

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react"
import { type FieldTimelineEvent } from "@/lib/mock-field-session"
import { cn } from "@/lib/utils"

const marks = [0, 15, 30, 45, 60, 75, 90]
const maxMinute = 90

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
  const currentPct = Math.min(100, (minute / maxMinute) * 100)

  return (
    <section className="space-y-4 rounded-[22px] bg-card/12 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/35">Timeline</span>
          <p className="mt-1 text-sm font-semibold">Treino ao vivo - {minute}:00</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex size-8 items-center justify-center rounded-full bg-surface/70 text-foreground/60 hover:text-foreground" onClick={() => onMinuteChange(Math.max(0, minute - 3))} aria-label="Voltar">
            <SkipBack className="size-3.5" />
          </button>
          <button type="button" className="flex size-9 items-center justify-center rounded-full bg-foreground text-background" onClick={() => onPlayingChange(!playing)} aria-label={playing ? "Pausar" : "Reproduzir"}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button type="button" className="flex size-8 items-center justify-center rounded-full bg-surface/70 text-foreground/60 hover:text-foreground" onClick={() => onMinuteChange(Math.min(maxMinute, minute + 3))} aria-label="Avancar">
            <SkipForward className="size-3.5" />
          </button>
          {!followingLive && (
            <button type="button" onClick={onReturnToLive} className="ml-1 flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
              <RotateCcw className="size-3.5" />
              Live
            </button>
          )}
        </div>
      </div>

      <div className="relative h-16">
        <div className="absolute inset-x-0 top-8 h-px bg-foreground/14" />
        <div className="absolute left-0 top-8 h-px bg-foreground" style={{ width: `${currentPct}%` }} />
        <span className="absolute top-[25px] size-4 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_24px_rgba(255,255,255,0.34)]" style={{ left: `${currentPct}%` }} />

        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onMinuteChange(event.minute)}
            className={cn(
              "absolute top-[26px] size-3 -translate-x-1/2 rounded-full transition-transform hover:scale-125",
              event.type === "alert" ? "bg-alert" : event.type === "issue" ? "bg-warn" : event.type === "decision" ? "bg-info" : "bg-foreground/45",
            )}
            style={{ left: `${(event.minute / maxMinute) * 100}%` }}
            title={event.label}
          />
        ))}

        {marks.map((mark) => (
          <span
            key={mark}
            className="absolute bottom-0 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/35"
            style={{ left: `${(mark / maxMinute) * 100}%` }}
          >
            {String(mark).padStart(2, "0")}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.14em] text-foreground/40">
        {events.filter((event) => Math.abs(event.minute - minute) <= 8).map((event) => (
          <span key={event.id}>{event.label}</span>
        ))}
      </div>
    </section>
  )
}
