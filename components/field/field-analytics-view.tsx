"use client"

import { AnimatePresence, motion } from "framer-motion"
import { fieldMetrics, fieldPlayers, type FieldMetric } from "@/lib/field-data"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
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
  const visiblePlayers = selectedId ? fieldPlayers.filter((player) => player.id === selectedId) : fieldPlayers

  return (
    <div className="grid h-full min-h-[560px] gap-5 bg-[#000000] px-4 pb-5 pt-16 md:grid-cols-[1fr_260px] md:px-8 md:pt-20">
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/40">Plano analítico</span>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Campo top-down</h2>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
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
        </div>

        <motion.div
          layoutId="athletic-field-surface"
          className="relative mt-5 aspect-[1.62/1] min-h-[330px] overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,rgba(22,80,42,0.36),rgba(13,45,27,0.36),rgba(22,80,42,0.36))]"
          initial={{ opacity: 0, rotateX: 20, scale: 0.96 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          transition={spring}
        >
          <div className="absolute inset-0 bg-background/30" />
          <FlatFieldLines />

          <AnimatePresence mode="wait">
            {metric === "heatmap" && (
              <motion.div key="heatmap" className="absolute inset-0" initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={spring}>
                {visiblePlayers.flatMap((player) =>
                  player.heatmapPoints.map((point, index) => (
                    <span
                      key={`${player.id}-${index}`}
                      className="absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        opacity: point.intensity * 0.34,
                        background: "radial-gradient(circle, rgba(255,211,77,0.9), rgba(255,82,82,0.42), transparent 68%)",
                      }}
                    />
                  )),
                )}
              </motion.div>
            )}

            {["routes", "distance", "accelerations", "decelerations", "playerLoad"].includes(metric) && (
              <motion.svg key="routes" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {visiblePlayers.map((player, index) => (
                  <motion.path
                    key={player.id}
                    d={routePath(player.routes)}
                    fill="none"
                    stroke={metric === "playerLoad" ? "var(--warn)" : "var(--good)"}
                    strokeWidth={metric === "playerLoad" ? 1.1 : 0.7}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ ...spring, delay: index * 0.08 }}
                  />
                ))}
              </motion.svg>
            )}

            {metric === "sprints" && (
              <motion.div key="sprints" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {visiblePlayers.flatMap((player) =>
                  player.sprints.map((point, index) => (
                    <motion.span
                      key={`${player.id}-sprint-${index}`}
                      className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-alert"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.55] }}
                      transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.12 }}
                    />
                  )),
                )}
              </motion.div>
            )}

            {metric === "shots" && (
              <motion.div key="shots" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {visiblePlayers.flatMap((player) =>
                  player.shots.map((point, index) => (
                    <motion.span
                      key={`${player.id}-shot-${index}`}
                      className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/60 text-[8px] font-bold"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ ...spring, delay: index * 0.08 }}
                    >
                      T
                    </motion.span>
                  )),
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {fieldPlayers.map((player) => (
            <PlayerFieldCard key={player.id} player={player} selected={selected.id === player.id} onSelect={onSelect} compact />
          ))}
        </motion.div>
      </div>

      <motion.aside variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col justify-between bg-background/20 p-1 md:pt-14">
        <div>
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
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4">
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
