"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { fieldPlayers } from "@/lib/field-data"
import { softSpring, staggerContainer, staggerItem } from "@/lib/motion"
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const selectedPlayer = fieldPlayers.find((player) => player.id === selectedId) ?? fieldPlayers[0]
  const previewPlayer = fieldPlayers.find((player) => player.id === hoveredId) ?? selectedPlayer
  const centeredPlayers = useMemo(() => {
    const selectedIndex = Math.max(
      0,
      fieldPlayers.findIndex((player) => player.id === selectedPlayer.id),
    )
    const beforeCenter = Math.floor((fieldPlayers.length - 1) / 2)

    return fieldPlayers.map((_, index) => {
      const nextIndex = (selectedIndex - beforeCenter + index + fieldPlayers.length) % fieldPlayers.length
      return fieldPlayers[nextIndex]
    })
  }, [selectedPlayer.id])

  const openPlayerAnalysis = (id: string) => {
    onSelect(id)
    window.setTimeout(onNext, 220)
  }

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#000000] px-4 pb-4 pt-12 md:px-8 md:pt-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/40">Modelo tatico</span>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground md:text-xl">Campo Athletic 3D</h2>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="pt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground md:text-[10px]"
        >
          Abrir analise plana
        </button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto mt-0 flex w-full max-w-5xl justify-center gap-2.5 overflow-x-auto pb-1 no-scrollbar"
      >
        {centeredPlayers.map((player) => {
          const selected = selectedId === player.id
          return (
            <motion.button
              key={player.id}
              variants={staggerItem}
              layoutId={`field-player-card-${player.id}`}
              onMouseEnter={() => setHoveredId(player.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(player.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => openPlayerAnalysis(player.id)}
              whileHover={{ y: -6, scale: selected ? 1.04 : 1.03 }}
              transition={softSpring}
              className={cn(
                "relative h-24 shrink-0 overflow-hidden rounded-2xl bg-card/35 text-left will-change-transform",
                selected ? "w-48 ring-1 ring-foreground/35" : "w-28 opacity-65",
              )}
            >
              <Image
                src={player.photo}
                alt={player.fullName}
                fill
                sizes="192px"
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

      <div className="relative -mt-6 flex min-h-0 flex-1 items-start justify-center overflow-hidden [perspective:1600px] md:-mt-8">
        <motion.div
          layoutId="athletic-field-surface"
          className="relative aspect-[1.62/1] max-h-[58vh] w-full max-w-4xl overflow-hidden rounded-[28px] shadow-[0_42px_120px_-50px_rgba(255,255,255,0.25)] [transform-style:preserve-3d]"
          initial={{ opacity: 0, rotateX: 64, x: 42, y: 26, scale: 0.92, filter: "blur(6px)" }}
          animate={{ opacity: 1, rotateX: 56, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, rotateX: 14, scale: 1.04 }}
          transition={softSpring}
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(90deg,rgba(38,95,54,0.42)_0%,rgba(20,65,37,0.42)_12%,rgba(38,95,54,0.42)_24%,rgba(20,65,37,0.42)_36%,rgba(38,95,54,0.42)_48%,rgba(20,65,37,0.42)_60%,rgba(38,95,54,0.42)_72%,rgba(20,65,37,0.42)_84%,rgba(38,95,54,0.42)_100%)]" />
          <div className="absolute inset-0 rounded-[28px] bg-background/20" />
          {previewPlayer.heatmapPoints.map((point, index) => (
            <motion.span
              key={`${previewPlayer.id}-preview-heat-${index}`}
              className="absolute size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                opacity: point.intensity * 0.28,
                background: "radial-gradient(circle, rgba(255,211,77,0.85), rgba(255,82,82,0.34), transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: point.intensity * 0.28, scale: 1 }}
              transition={softSpring}
            />
          ))}
          <FieldLines />
          <motion.div
            key={previewPlayer.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${previewPlayer.fieldPosition.x}%`, top: `${previewPlayer.fieldPosition.y}%` }}
            initial={{ opacity: 0, scale: 0.82, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={softSpring}
          >
            <div className="mx-auto h-12 w-28 rounded-full bg-foreground/12 blur-xl" />
            <span className="mt-[-28px] block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70 drop-shadow-[0_12px_24px_rgba(255,255,255,0.18)]">
              {previewPlayer.name}
            </span>
            <span className="mt-1 block text-[8px] uppercase tracking-[0.16em] text-foreground/35">
              {previewPlayer.position} · zona {previewPlayer.zone}
            </span>
          </motion.div>
          <div className="absolute bottom-5 left-5 z-20 flex flex-wrap gap-3 text-[8px] uppercase tracking-[0.14em] text-foreground/45">
            <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[var(--warn)]" /> Toques</span>
            <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[var(--alert)]" /> Pressao</span>
            <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[var(--good)]" /> Carga</span>
          </div>
        </motion.div>
        <div className="pointer-events-none absolute bottom-[10%] h-10 w-2/3 rounded-full bg-foreground/10 blur-3xl" />
      </div>
    </div>
  )
}
