"use client"

import { useMemo } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { fieldMetrics, fieldPlayers, type FieldMetric } from "@/lib/field-data"
import { cn } from "@/lib/utils"
import { softSpring, spring, staggerContainer, staggerItem } from "@/lib/motion"
import { PlayerFieldCard } from "./player-field-card"

function FlatFieldLines() {
  return (
    <>
      <div className="absolute inset-[4%] border border-white/55" />
      <div className="absolute bottom-[4%] left-1/2 top-[4%] w-px bg-white/35" />
      <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35" />
      <div className="absolute left-[4%] top-1/2 h-36 w-20 -translate-y-1/2 border border-l-0 border-white/45" />
      <div className="absolute right-[4%] top-1/2 h-36 w-20 -translate-y-1/2 border border-r-0 border-white/45" />
      <div className="absolute left-[4%] top-1/2 h-16 w-8 -translate-y-1/2 border border-l-0 border-white/45" />
      <div className="absolute right-[4%] top-1/2 h-16 w-8 -translate-y-1/2 border border-r-0 border-white/45" />
    </>
  )
}

function routePath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
}

function vectorPath(vector: { x: number; y: number; dx: number; dy: number }) {
  return `M ${vector.x} ${vector.y} L ${vector.x + vector.dx} ${vector.y + vector.dy}`
}

function HeatmapLayer({ points, id }: { points: { x: number; y: number; intensity: number }[]; id: string }) {
  return (
    <motion.div
      key={id}
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 0.98, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={spring}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_35%,rgba(36,185,255,0.30),transparent_24%),radial-gradient(circle_at_54%_46%,rgba(35,206,120,0.22),transparent_28%),radial-gradient(circle_at_78%_52%,rgba(36,185,255,0.24),transparent_18%)]" />
      {points.map((point, index) => (
        <span
          key={`${id}-${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${118 + index * 18}px`,
            height: `${82 + index * 14}px`,
            opacity: 0.42 + point.intensity * 0.34,
            background:
              "radial-gradient(circle, rgba(255,28,28,0.92) 0%, rgba(255,205,34,0.82) 34%, rgba(80,220,96,0.42) 58%, rgba(33,155,255,0.18) 78%, transparent 100%)",
          }}
        />
      ))}
    </motion.div>
  )
}

export function FieldAnalyticsView({
  selectedId,
  metric,
  onMetricChange,
  onSelect,
}: {
  selectedId?: string
  metric: FieldMetric
  onMetricChange: (metric: FieldMetric) => void
  onSelect: (id: string) => void
}) {
  const selected = fieldPlayers.find((player) => player.id === selectedId) ?? fieldPlayers[0]
  const centeredPlayers = useMemo(() => {
    const selectedIndex = Math.max(
      0,
      fieldPlayers.findIndex((player) => player.id === selected.id),
    )
    const beforeCenter = Math.floor((fieldPlayers.length - 1) / 2)

    return fieldPlayers.map((_, index) => {
      const nextIndex = (selectedIndex - beforeCenter + index + fieldPlayers.length) % fieldPlayers.length
      return fieldPlayers[nextIndex]
    })
  }, [selected.id])

  return (
    <div className="grid h-screen min-h-0 gap-3 overflow-hidden bg-[#000000] px-4 pb-4 pt-12 md:grid-cols-[1fr_250px] md:px-8 md:pt-12">
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/40">Plano analítico</span>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground md:text-xl">Campo top-down</h2>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto mt-0 flex w-full max-w-5xl justify-center gap-2.5 overflow-x-auto pb-1 no-scrollbar"
        >
          {centeredPlayers.map((player) => {
            const active = selected.id === player.id
            return (
              <motion.button
                key={player.id}
                variants={staggerItem}
                onClick={() => onSelect(player.id)}
                whileHover={{ y: -6, scale: active ? 1.04 : 1.03 }}
                transition={softSpring}
                className={cn(
                  "relative h-20 shrink-0 overflow-hidden rounded-2xl bg-card/35 text-left will-change-transform",
                  active ? "w-44 ring-1 ring-foreground/35" : "w-24 opacity-55",
                )}
              >
                <Image src={player.photo} alt={player.fullName} fill sizes="176px" className="object-cover object-top opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <span className="absolute left-2 top-2 text-[9px] font-bold text-foreground">{player.number}</span>
                <span className="absolute right-2 top-2 text-[8px] uppercase tracking-[0.12em] text-foreground/45">{player.position}</span>
                <span className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-semibold text-foreground">{player.name}</span>
              </motion.button>
            )
          })}
        </motion.div>

        <div className="mt-1 flex max-w-full gap-2 overflow-x-auto pb-2 no-scrollbar">
          {fieldMetrics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onMetricChange(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] transition-colors",
                metric === item.id ? "bg-foreground text-background" : "bg-surface/70 text-foreground/45 hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <motion.div
          layoutId="athletic-field-surface"
          className="relative mt-4 aspect-[1.62/1] max-h-[55vh] min-h-[280px] overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,rgba(22,80,42,0.36),rgba(13,45,27,0.36),rgba(22,80,42,0.36))] md:mt-5"
          initial={{ opacity: 0, rotateX: 58, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, rotateX: 0, y: -4, scale: 1.02 }}
          transition={softSpring}
        >
          <div className="absolute inset-0 bg-background/30" />
          <FlatFieldLines />

          <AnimatePresence mode="wait">
            {metric === "heatmap" && (
              <HeatmapLayer key="heatmap" id={selected.id} points={selected.heatmapPoints} />
            )}

            {["routes", "distance", "playerLoad", "speedZone"].includes(metric) && (
              <motion.svg key={metric} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.path
                  d={routePath(metric === "distance" ? selected.distanceTrail : selected.routes)}
                  fill="none"
                  stroke={metric === "playerLoad" ? "var(--warn)" : metric === "speedZone" ? "var(--info)" : "var(--good)"}
                  strokeWidth={metric === "playerLoad" ? 1.4 : 0.95}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={spring}
                />
                {(metric === "distance" ? selected.distanceTrail : selected.routes).map((point, index, list) => (
                  <motion.circle
                    key={`${metric}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={index === 0 || index === list.length - 1 ? 1.2 : 0.75}
                    fill={index === 0 ? "var(--good)" : index === list.length - 1 ? "var(--foreground)" : "rgba(255,255,255,0.65)"}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...spring, delay: index * 0.08 }}
                  />
                ))}
              </motion.svg>
            )}

            {["accelerations", "decelerations"].includes(metric) && (
              <motion.svg key={metric} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {(metric === "accelerations" ? selected.accelerations : selected.decelerations).map((vector, index) => (
                  <motion.path
                    key={index}
                    d={vectorPath(vector)}
                    fill="none"
                    stroke={metric === "accelerations" ? "var(--good)" : "var(--warn)"}
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{ ...spring, delay: index * 0.08 }}
                  />
                ))}
                {(metric === "accelerations" ? selected.accelerations : selected.decelerations).map((vector, index) => (
                  <motion.circle
                    key={`dot-${index}`}
                    cx={vector.x + vector.dx}
                    cy={vector.y + vector.dy}
                    r={1}
                    fill={metric === "accelerations" ? "var(--good)" : "var(--warn)"}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                    transition={{ ...spring, delay: index * 0.1 }}
                  />
                ))}
              </motion.svg>
            )}

            {metric === "sprints" && (
              <motion.div key="sprints" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {selected.sprints.map((point, index) => (
                  <motion.span
                    key={`${selected.id}-sprint-${index}`}
                    className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-alert"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.55] }}
                    transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.12 }}
                  />
                ))}
              </motion.div>
            )}

            {metric === "shots" && (
              <motion.svg key="shots" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {selected.shots.map((shot, index) => (
                  <motion.path
                    key={index}
                    d={`M ${shot.x} ${shot.y} L ${shot.targetX} ${shot.targetY}`}
                    fill="none"
                    stroke={shot.result === "gol" ? "var(--good)" : "var(--alert)"}
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ ...spring, delay: index * 0.08 }}
                  />
                ))}
                {selected.shots.map((shot, index) => (
                  <motion.circle
                    key={`shot-target-${index}`}
                    cx={shot.targetX}
                    cy={shot.targetY}
                    r={1.15}
                    fill={shot.result === "gol" ? "var(--good)" : "var(--alert)"}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.45, 1], opacity: 1 }}
                    transition={{ ...spring, delay: index * 0.12 }}
                  />
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          {fieldPlayers.map((player) => (
            <PlayerFieldCard key={player.id} player={player} selected={selected.id === player.id} onSelect={onSelect} compact />
          ))}
        </motion.div>
      </div>

      <motion.aside variants={staggerContainer} initial="initial" animate="animate" className="relative overflow-hidden bg-background/20 p-1 md:pt-10">
        <Image src={selected.photo} alt={selected.fullName} fill sizes="250px" className="object-cover object-top opacity-42" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/64 to-background/20" />
        <div className="relative z-10">
          <motion.span variants={staggerItem} className="block text-[9px] uppercase tracking-[0.24em] text-foreground/40">
            Atleta selecionado
          </motion.span>
          <motion.div variants={staggerItem} className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold leading-none">{selected.number}</span>
            <div>
              <h3 className="text-lg font-semibold leading-none">{selected.name}</h3>
              <span className="text-[10px] uppercase tracking-[0.16em] text-foreground/45">{selected.position}</span>
            </div>
          </motion.div>
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3">
            {[
              ["Distância", `${selected.catapult.distance.toFixed(1)} km`],
              ["Vel. máx.", `${selected.catapult.maxSpeed.toFixed(1)} km/h`],
              ["Sprints", selected.catapult.sprints],
              ["Player Load", selected.catapult.playerLoad],
              ["Acel.", selected.catapult.accelerations],
              ["Recovery", `${selected.apollo.recovery}%`],
            ].map(([label, value]) => (
              <motion.div key={label} variants={staggerItem} className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.14em] text-foreground/35">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </div>
  )
}
