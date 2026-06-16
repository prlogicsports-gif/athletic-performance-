"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { calendarDays, weekDayLabels, dayTypeMeta, type DayType } from "@/lib/data"
import { cn } from "@/lib/utils"

const views = ["Mês", "Semana", "Lista"]

function ClubBadge({ name }: { name: string }) {
  const initials = name.replace("-", " ").split(" ").map((w) => w[0]).join("").slice(0, 2)
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-surface text-[9px] font-bold">
      {initials}
    </span>
  )
}

export function CalendarScreen() {
  const [view, setView] = useState("Mês")

  return (
    <div className="px-6 pb-16 md:px-10">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            Setembro <span className="font-light text-muted-foreground">2024</span>
          </h2>
          <div className="flex gap-1">
            <button aria-label="Mês anterior" className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <ChevronLeft className="size-4" />
            </button>
            <button aria-label="Próximo mês" className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex rounded-full bg-surface p-0.5">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                  view === v ? "text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {view === v && (
                  <motion.span layoutId="cal-view" className="absolute inset-0 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative z-10">{v}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* weekday header */}
      <div className="mt-8 grid grid-cols-7 gap-px">
        {weekDayLabels.map((d) => (
          <div key={d} className="pb-3 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-border">
        {calendarDays.map((d, i) => {
          const isTrailing = d && d.day <= 6 && i > 33
          const meta = d?.type ? dayTypeMeta[d.type as DayType] : null
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.008, 0.4) }}
              className={cn(
                "min-h-24 border-b border-r border-border p-2.5 last:border-r-0",
                d?.current && "bg-surface/60",
              )}
            >
              {d && (
                <>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-semibold", (isTrailing || !d.type) && i > 0 && !d.type ? "text-muted-foreground/50" : "")}>
                      {d.day}
                    </span>
                    {d.match && <ClubBadge name={d.match} />}
                  </div>
                  {d.type && (
                    <div className="mt-2 flex flex-col gap-1">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          d.type === "viagem" && "text-warn",
                          d.type === "recuperacao" && "text-info",
                          d.type === "jogo" && "font-semibold",
                        )}
                      >
                        {d.title}
                      </span>
                      {d.sub && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{d.sub}</span>}
                      <span className="mt-1 size-2 rounded-full" style={{ backgroundColor: `var(--${meta?.token})` }} />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* legend + photo */}
      <div className="relative mt-8 overflow-hidden">
        <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-3">
          {(Object.keys(dayTypeMeta) as DayType[]).map((t) => (
            <span key={t} className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: `var(--${dayTypeMeta[t].token})` }} />
              {dayTypeMeta[t].label}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute -bottom-10 right-0 h-64 w-full max-w-2xl opacity-70">
          <Image src="/athletes/celebration.png" alt="Comemoração da equipe" fill className="object-contain object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>
      </div>
    </div>
  )
}
