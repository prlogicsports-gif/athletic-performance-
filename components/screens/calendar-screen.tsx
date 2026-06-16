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
    <div className="relative mx-auto max-w-6xl px-4 pb-12 md:px-8">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tight md:text-2xl">
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
          <div className="relative flex rounded-md bg-surface/55 p-0.5">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "relative rounded-[5px] px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors",
                  view === v ? "text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {view === v && (
                  <motion.span layoutId="cal-view" className="absolute inset-0 rounded-[5px] bg-foreground" transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.9 }} />
                )}
                <span className="relative z-10">{v}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-md bg-surface/55 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* weekday header */}
      <div className="mt-5 grid grid-cols-7 gap-px">
        {weekDayLabels.map((d) => (
          <div key={d} className="pb-3 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="relative z-10 grid grid-cols-7 overflow-hidden rounded-lg border border-foreground/10 bg-background/20">
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
                "min-h-16 border-b border-r border-foreground/10 p-2 last:border-r-0 sm:min-h-[74px]",
                d?.current && "bg-foreground/[0.04]",
              )}
            >
              {d && (
                <>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-semibold", (isTrailing || !d.type) && i > 0 && !d.type ? "text-muted-foreground/50" : "")}>
                      {d.day}
                    </span>
                    {d.match && <ClubBadge name={d.match} />}
                  </div>
                  {d.type && (
                    <div className="mt-2 flex flex-col gap-1">
                      <span
                        className={cn(
                          "text-[11px] font-medium",
                          d.type === "viagem" && "text-warn",
                          d.type === "recuperacao" && "text-info",
                          d.type === "jogo" && "font-semibold",
                        )}
                      >
                        {d.title}
                      </span>
                      {d.sub && <span className="text-[9px] uppercase tracking-wide text-muted-foreground">{d.sub}</span>}
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
      <div className="relative mt-6 min-h-56 overflow-hidden">
        <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-3">
          {(Object.keys(dayTypeMeta) as DayType[]).map((t) => (
            <span key={t} className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: `var(--${dayTypeMeta[t].token})` }} />
              {dayTypeMeta[t].label}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-80 w-full max-w-xl -translate-x-1/2 opacity-85">
          <Image src="/calendar-team.png" alt="Jogadores do Athletic" fill className="object-contain object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/5" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </div>
  )
}
