"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { athletes, positionFilters } from "@/lib/data"
import { cn } from "@/lib/utils"

const squadTabs = ["Elenco", "Comissão Técnica"]

export function CarouselScreen({ onSelectAthlete }: { onSelectAthlete: (id: string) => void }) {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState<(typeof positionFilters)[number]>("Todos")
  const [squad, setSquad] = useState(squadTabs[0])

  const list = athletes

  const go = (dir: number) => {
    setActive((p) => (p + dir + list.length) % list.length)
  }

  return (
    <div className="px-4 md:px-8">
      {/* filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {squadTabs.map((t) => (
            <button
              key={t}
              onClick={() => setSquad(t)}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors",
                squad === t ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {positionFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors",
                filter === f ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* carousel */}
      <div className="relative mt-4 flex h-[480px] items-center justify-center [perspective:2200px]">
        {list.map((a, i) => {
          let offset = i - active
          if (offset > list.length / 2) offset -= list.length
          if (offset < -list.length / 2) offset += list.length
          const abs = Math.abs(offset)
          if (abs > 2) return null
          const isCenter = offset === 0
          return (
            <motion.button
              key={a.id}
              onClick={() => (isCenter ? onSelectAthlete(a.id) : setActive(i))}
              className="absolute origin-center overflow-hidden rounded-[28px]"
              style={{ width: 310, height: 450 }}
              animate={{
                x: offset * 240,
                scale: abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.55 : 0.18,
                filter: abs === 0 ? "blur(0px)" : abs === 1 ? "blur(1px)" : "blur(5px)",
                zIndex: 50 - abs,
                rotateY: offset * -14,
                translateZ: abs === 0 ? 120 : abs === 1 ? -40 : -180,
              }}
              whileHover={
                isCenter
                  ? {
                      scale: 1.03,
                      y: -10,
                    }
                  : {
                      scale: 0.82,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.9,
              }}
            >
              <div
                className={cn(
                  "relative h-full w-full bg-gradient-to-b from-surface via-card to-background",
                  isCenter && "ring-1 ring-foreground/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]",
                )}
              >
                <Image
                  src={a.photo || "/placeholder.svg"}
                  alt={`${a.firstName} ${a.lastName}`}
                  fill
                  priority={isCenter}
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />

                {/* number */}
                <div
                  className={cn(
                    "absolute right-5 top-6 flex items-center justify-center rounded-full border border-foreground/40 bg-background/40 backdrop-blur-sm",
                    isCenter ? "size-12 text-xl" : "size-9 text-sm",
                  )}
                >
                  <span className="font-bold">{a.number}</span>
                </div>

                {/* name */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-4 pb-6 text-center">
                  <span className={cn("font-medium", isCenter ? "text-base" : "text-xs")}>{a.firstName}</span>
                  <span className={cn("font-bold leading-none tracking-tight", isCenter ? "text-4xl" : "text-xl")}>
                    {a.lastName}
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {a.position}
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}

        {/* nav arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="absolute left-2 z-20 flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-surface md:left-6"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Próximo"
          className="absolute right-2 z-20 flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-surface md:right-6"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* dots + hint */}
      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ir para atleta ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-foreground" : "w-1.5 bg-muted",
              )}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Toque no atleta central para ver o perfil
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
