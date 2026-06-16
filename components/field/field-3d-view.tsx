"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { fieldPlayers } from "@/lib/field-data"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
    <div className="flex h-full min-h-[560px] flex-col bg-[#000000] px-4 pb-5 pt-16 md:px-8 md:pt-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/40">Modelo tático</span>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground md:text-xl">Campo Athletic 3D</h2>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="pt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground md:text-[10px]"
        >
          Abrir análise plana
        </button>
      </div>

      <div className="relative mt-3 flex flex-1 items-center justify-center overflow-hidden [perspective:1600px] md:mt-5">
        <motion.div
          layoutId="athletic-field-surface"
          className="relative aspect-[1.62/1] w-full max-w-5xl overflow-hidden rounded-[28px] shadow-[0_42px_120px_-50px_rgba(255,255,255,0.25)] [transform-style:preserve-3d]"
          initial={{ opacity: 0, rotateX: 72, rotateY: -7, x: 90, y: 60, scale: 0.86, filter: "blur(8px)" }}
          animate={{ opacity: 1, rotateX: 58, rotateY: 0, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, rotateX: 14, scale: 1.04 }}
          transition={spring}
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(90deg,rgba(38,95,54,0.42)_0%,rgba(20,65,37,0.42)_12%,rgba(38,95,54,0.42)_24%,rgba(20,65,37,0.42)_36%,rgba(38,95,54,0.42)_48%,rgba(20,65,37,0.42)_60%,rgba(38,95,54,0.42)_72%,rgba(20,65,37,0.42)_84%,rgba(38,95,54,0.42)_100%)]" />
          <div className="absolute inset-0 rounded-[28px] bg-background/20" />
          <FieldLines />
        </motion.div>
        <div className="pointer-events-none absolute bottom-[10%] h-10 w-2/3 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar"
      >
        {fieldPlayers.map((player) => {
          const selected = selectedId === player.id
          return (
            <motion.button
              key={player.id}
              variants={staggerItem}
              layoutId={`field-player-card-${player.id}`}
              onClick={() => onSelect(player.id)}
              whileHover={{ y: -6, scale: selected ? 1.04 : 1.02 }}
              transition={spring}
              className={cn(
                "relative h-28 shrink-0 overflow-hidden rounded-2xl bg-card/35 text-left will-change-transform",
                selected ? "w-44 ring-1 ring-foreground/35" : "w-32 opacity-70",
              )}
            >
              <Image
                src={player.photo}
                alt={player.fullName}
                fill
                sizes="176px"
                className="object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
              <span className="absolute left-3 top-2 text-[10px] font-bold text-foreground">{player.number}</span>
              <span className="absolute right-3 top-2 text-[8px] uppercase tracking-[0.12em] text-foreground/45">{player.position}</span>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="block truncate text-xs font-semibold text-foreground">{player.name}</span>
                {selected && (
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.12em] text-foreground/45">
                    {player.catapult.distance.toFixed(1)} km · {player.catapult.playerLoad} UA
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
