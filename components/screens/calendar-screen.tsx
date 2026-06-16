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
    <div className="relative overflow-hidden px-4 pb-8 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] opacity-35">
        <Image src="/calendar-stadium-bg.png" alt="Arena do Athletic" fill priority className="object-cover object-center" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
        <div className="absolute inset-0 bg-background/35" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold uppercase tracking-tight md:text-xl">
            Setembro <span className="font-light text-muted-foreground">2024</span>
          </h2>
          <div className="flex gap-1">
            <button aria-label="Mês anterior" className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <ChevronLeft className="size-3.5" />
            </button>
            <button aria-label="Próximo mês" className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <ChevronRight className="size-3.5" />
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
                  "relative rounded-[5px] px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide transition-colors",
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
          <button className="flex items-center gap-2 rounded-md bg-surface/55 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* weekday header */}
      <div className="mt-5 grid grid-cols-7 gap-px">
        {weekDayLabels.map((d) => (
          <div key={d} className="pb-2 text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="relative z-10 grid grid-cols-7 bg-background/10">
        {calendarDays.map((d, i) => {
          const isTrailing = d && d.day <= 6 && i > 33
          const isLastCol = i % 7 === 6
          const isLastRow = i >= calendarDays.length - 7
          const meta = d?.type ? dayTypeMeta[d.type as DayType] : null
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.008, 0.4) }}
              className={cn(
                "min-h-12 p-1.5 sm:min-h-14",
                !isLastCol && "border-r border-foreground/10",
                !isLastRow && "border-b border-foreground/10",
                d?.current && "bg-foreground/[0.04]",
              )}
            >
              {d && (
                <>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[11px] font-semibold", (isTrailing || !d.type) && i > 0 && !d.type ? "text-muted-foreground/50" : "")}>
                      {d.day}
                    </span>
                    {d.match && <ClubBadge name={d.match} />}
                  </div>
                  {d.type && (
                    <div className="mt-1.5 flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          d.type === "viagem" && "text-warn",
                          d.type === "recuperacao" && "text-info",
                          d.type === "jogo" && "font-semibold",
                        )}
                      >
                        {d.title}
                      </span>
                      {d.sub && <span className="text-[8px] uppercase tracking-wide text-muted-foreground">{d.sub}</span>}
                      <span className="mt-0.5 size-1.5 rounded-full" style={{ backgroundColor: `var(--${meta?.token})` }} />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* legend */}
      <div className="relative -mt-3 min-h-28">
        <div className="relative z-30 mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {(Object.keys(dayTypeMeta) as DayType[]).map((t) => (
            <span key={t} className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: `var(--${dayTypeMeta[t].token})` }} />
              {dayTypeMeta[t].label}
            </span>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
