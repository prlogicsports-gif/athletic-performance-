"use client"

import { AnimatePresence, motion } from "framer-motion"
import { type FieldLayer, type LiveFieldPlayer } from "@/lib/mock-field-session"
import { FieldAccelerationLayer } from "./field-acceleration-layer"
import { FieldActionsLayer } from "./field-actions-layer"
import { FieldHeatmapLayer } from "./field-heatmap-layer"
import { FieldPlayerMarker } from "./field-player-marker"
import { FieldRoutesLayer } from "./field-routes-layer"
import { FieldShotsLayer } from "./field-shots-layer"
import { FieldSprintsLayer } from "./field-sprints-layer"

function PitchLines() {
  return (
    <>
      <div className="absolute inset-[4.2%] border border-white/38" />
      <div className="absolute bottom-[4.2%] left-1/2 top-[4.2%] w-px bg-white/22" />
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/22" />
      <div className="absolute left-[4.2%] top-1/2 h-[37%] w-[13%] -translate-y-1/2 border border-l-0 border-white/28" />
      <div className="absolute right-[4.2%] top-1/2 h-[37%] w-[13%] -translate-y-1/2 border border-r-0 border-white/28" />
      <div className="absolute left-[4.2%] top-1/2 h-[18%] w-[6%] -translate-y-1/2 border border-l-0 border-white/24" />
      <div className="absolute right-[4.2%] top-1/2 h-[18%] w-[6%] -translate-y-1/2 border border-r-0 border-white/24" />
    </>
  )
}

export function FieldPitch({
  players,
  selected,
  activeLayers,
  live,
  onSelect,
}: {
  players: LiveFieldPlayer[]
  selected: LiveFieldPlayer
  activeLayers: Set<FieldLayer>
  live: boolean
  onSelect: (id: string) => void
}) {
  return (
    <motion.div
      className="relative aspect-[105/68] min-h-[430px] overflow-hidden rounded-[28px] bg-[linear-gradient(90deg,rgba(22,80,42,0.38),rgba(13,45,27,0.30),rgba(22,80,42,0.38))] xl:min-h-[560px]"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 24, mass: 0.9 }}
    >
      <div className="absolute inset-0 bg-background/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,rgba(80,220,96,0.11),transparent_34%),radial-gradient(circle_at_72%_62%,rgba(255,211,49,0.07),transparent_28%)]" />
      <PitchLines />

      <AnimatePresence mode="wait">
        {activeLayers.has("heatmap") && <FieldHeatmapLayer key={`heat-${selected.id}`} player={selected} live={live} />}
        {activeLayers.has("routes") && <FieldRoutesLayer key={`route-${selected.id}`} player={selected} recent={live} />}
        {activeLayers.has("sprints") && <FieldSprintsLayer key={`sprints-${selected.id}`} player={selected} />}
        {activeLayers.has("shots") && <FieldShotsLayer key={`shots-${selected.id}`} player={selected} />}
        {activeLayers.has("actions") && <FieldActionsLayer key={`actions-${selected.id}`} player={selected} />}
        {activeLayers.has("accelerations") && <FieldAccelerationLayer key={`acc-${selected.id}`} player={selected} type="accelerations" />}
        {activeLayers.has("decelerations") && <FieldAccelerationLayer key={`dec-${selected.id}`} player={selected} type="decelerations" />}
      </AnimatePresence>

      {activeLayers.has("markers") && players.map((player) => (
        <FieldPlayerMarker key={player.id} player={player} selected={player.id === selected.id} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
