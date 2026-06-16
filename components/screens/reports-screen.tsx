"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { athletes } from "@/lib/data"
import { spring } from "@/lib/motion"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
})

const readiness = ["Pronto", "Monitorar", "Pronto", "Carga alta", "Pronto", "Monitorar"]

export function ReportsScreen() {
  return (
    <div className="px-4 pb-14 pt-1 md:px-8">
      <motion.div {...fade(0)} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Relatórios</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
            Base individual pronta para exportação futura
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">CSV · PDF · XLSX</span>
      </motion.div>

      <motion.div {...fade(0.06)} className="mt-6 overflow-x-auto no-scrollbar">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[1.55fr_0.7fr_0.7fr_0.7fr_0.8fr_1fr] gap-4 pb-3 text-[9px] uppercase tracking-[0.16em] text-foreground/35">
            <span>Atleta</span>
            <span>Distância</span>
            <span>Carga</span>
            <span>Sprints</span>
            <span>Zona</span>
            <span>Status</span>
          </div>

          <div className="flex flex-col gap-2">
            {athletes.map((a, i) => (
              <motion.div
                key={a.id}
                {...fade(0.08 + i * 0.025)}
                whileHover={{ x: 6, scale: 1.01 }}
                transition={spring}
                className="grid grid-cols-[1.55fr_0.7fr_0.7fr_0.7fr_0.8fr_1fr] items-center gap-4 rounded-xl bg-card/25 px-3 py-2.5 text-xs will-change-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-card/45">
                    <Image src={a.photo || "/placeholder.svg"} alt={`${a.firstName} ${a.lastName}`} fill className="object-cover object-top" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold text-foreground">
                      {a.number} · {a.firstName} {a.lastName}
                    </span>
                    <span className="mt-0.5 truncate text-[9px] uppercase tracking-[0.14em] text-foreground/40">
                      {a.position}
                    </span>
                  </div>
                </div>
                <span className="font-medium tabular-nums">{a.distance} km</span>
                <span className="tabular-nums">{Math.round(a.distance * 34)} UA</span>
                <span className="tabular-nums">{Math.round(a.distance * 5.4)}</span>
                <span className="text-foreground/60">Z{a.zone}</span>
                <span className="text-foreground/70">{readiness[i] ?? "Pronto"}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
