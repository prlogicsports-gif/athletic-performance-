"use client"

import { motion } from "framer-motion"
import { fieldPlayers } from "@/lib/field-data"
import { spring, staggerContainer } from "@/lib/motion"
import { PlayerFieldCard } from "./player-field-card"

function FieldLines() {
  return (
    <>
      <div className="absolute inset-[7%] border border-white/70" />
      <div className="absolute bottom-[7%] left-1/2 top-[7%] w-px bg-white/45" />
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45" />
      <div className="absolute left-[7%] top-1/2 h-40 w-20 -translate-y-1/2 border border-l-0 border-white/55" />
      <div className="absolute right-[7%] top-1/2 h-40 w-20 -translate-y-1/2 border border-r-0 border-white/55" />
      <div className="absolute left-[7%] top-1/2 h-20 w-8 -translate-y-1/2 border border-l-0 border-white/55" />
      <div className="absolute right-[7%] top-1/2 h-20 w-8 -translate-y-1/2 border border-r-0 border-white/55" />
      <div className="absolute left-[5%] top-1/2 h-16 w-1 -translate-y-1/2 bg-white/80" />
      <div className="absolute right-[5%] top-1/2 h-16 w-1 -translate-y-1/2 bg-white/80" />
    </>
  )
}

export function Field3DView({
  selectedId,
  onSelect,
  onNext,
}: {
  selectedId?: string
  onSelect: (id: string) => void
  onNext: () => void
}) {
  return (
    <div className="flex h-full min-h-[560px] flex-col bg-[#000000] px-4 py-5 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/40">Modelo tático</span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Campo Athletic 3D</h2>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
        >
          Abrir análise plana
        </button>
      </div>

      <div className="relative mt-6 flex flex-1 items-center justify-center overflow-hidden [perspective:1600px]">
        <motion.div
          layoutId="athletic-field-surface"
          className="relative aspect-[1.62/1] w-full max-w-5xl overflow-visible rounded-[28px] shadow-[0_42px_120px_-50px_rgba(255,255,255,0.25)] [transform-style:preserve-3d]"
          initial={{ opacity: 0, rotateX: 65, scale: 0.92 }}
          animate={{ opacity: 1, rotateX: 55, scale: 1 }}
          exit={{ opacity: 0, rotateX: 14, scale: 1.04 }}
          transition={spring}
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(90deg,rgba(38,95,54,0.42)_0%,rgba(20,65,37,0.42)_12%,rgba(38,95,54,0.42)_24%,rgba(20,65,37,0.42)_36%,rgba(38,95,54,0.42)_48%,rgba(20,65,37,0.42)_60%,rgba(38,95,54,0.42)_72%,rgba(20,65,37,0.42)_84%,rgba(38,95,54,0.42)_100%)]" />
          <div className="absolute inset-0 rounded-[28px] bg-background/20" />
          <FieldLines />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="absolute inset-[7%]">
            {fieldPlayers.map((player) => (
              <PlayerFieldCard
                key={player.id}
                player={player}
                selected={selectedId === player.id}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        </motion.div>
        <div className="pointer-events-none absolute bottom-[10%] h-10 w-2/3 rounded-full bg-foreground/10 blur-3xl" />
      </div>
    </div>
  )
}
