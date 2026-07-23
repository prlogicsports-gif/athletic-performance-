"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Radio } from "lucide-react"
import { useFieldAthletes } from "@/hooks/use-field-athletes"
import { useFieldLayers } from "@/hooks/use-field-layers"
import { useFieldSession } from "@/hooks/use-field-session"
import { useFieldTimeline } from "@/hooks/use-field-timeline"
import { useFieldValuations } from "@/hooks/use-field-valuations"
import { useLiveFieldData } from "@/hooks/use-live-field-data"
import { type FieldCardMetric, type FieldPreset, type FieldValuation } from "@/lib/mock-field-session"
import { staggerContainer } from "@/lib/motion"
import { FieldAthleteCarousel } from "./field-athlete-carousel"
import { FieldLegends } from "./field-legends"
import { FieldPitch } from "./field-pitch"
import { FieldSessionHeader } from "./field-session-header"
import { FieldSidePanel } from "./field-side-panel"
import { FieldTimeline } from "./field-timeline"
import { FieldValuationModal } from "./field-valuation-modal"
import { FieldValuationTabs } from "./field-valuation-tabs"

const positionFilters = ["TODOS", "ATA", "MEI", "VOL", "LAT", "ZAG", "GOL"] as const
type PositionFilter = (typeof positionFilters)[number]

const valuationPresetMap: Partial<Record<FieldValuation, FieldPreset>> = {
  overview: "clear",
  movement: "movement",
  load: "load",
  sprints: "sprints",
  speed: "intensity",
  distance: "movement",
  accelerations: "intensity",
  heartRate: "load",
  actions: "actions",
}

export function FieldPage({ onOpenAthlete }: { onOpenAthlete?: (id: string) => void }) {
  const { session, insights } = useFieldSession()
  const timeline = useFieldTimeline()
  const { players, isLive } = useLiveFieldData(session.mode, timeline.minute)
  const [selectedId, setSelectedId] = useState(players[0]?.id)
  const [cardMetric, setCardMetric] = useState<FieldCardMetric>("load")
  const [valuation, setValuation] = useState<FieldValuation>("movement")
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("TODOS")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { valuations, getValuation } = useFieldValuations()
  const { selected, cardMetricValue } = useFieldAthletes(selectedId, cardMetric)
  const visiblePlayers = players.filter((player) => {
    if (positionFilter === "TODOS") return true
    if (positionFilter === "LAT") return player.position === "LD" || player.position === "LE"
    if (positionFilter === "GOL") return player.position === "GOL"
    return player.position === positionFilter
  })
  const effectivePlayers = visiblePlayers.length ? visiblePlayers : players
  const liveSelected = effectivePlayers.find((player) => player.id === selected.id) ?? effectivePlayers[0] ?? selected
  const layers = useFieldLayers()

  const changePositionFilter = (next: PositionFilter) => {
    setPositionFilter(next)
    const filtered = players.filter((player) => {
      if (next === "TODOS") return true
      if (next === "LAT") return player.position === "LD" || player.position === "LE"
      if (next === "GOL") return player.position === "GOL"
      return player.position === next
    })
    if (filtered.length && !filtered.some((player) => player.id === selectedId)) setSelectedId(filtered[0].id)
  }

  const changeValuation = (next: FieldValuation) => {
    setValuation(next)
    const preset = valuationPresetMap[next]
    if (preset) layers.applyPreset(preset)
  }

  const openSelected = () => {
    if (onOpenAthlete) onOpenAthlete(liveSelected.id)
    else setDetailsOpen(true)
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="min-h-screen bg-[#000000] px-4 pb-10 pt-8 text-foreground md:px-8 md:pt-10">
      <div className="pointer-events-none sticky top-0 z-30 -mx-4 flex items-center justify-center bg-gradient-to-b from-background via-background/86 to-transparent px-4 py-3 md:-mx-8 md:px-8">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70">
          <span className="size-2 rounded-full bg-alert shadow-[0_0_18px_rgba(255,34,34,0.7)]" />
          <span>AO VIVO</span>
          <span>{timeline.minute}:15</span>
          <span className="hidden text-foreground/35 sm:inline">{session.name} - {session.activePeriod}</span>
          <span className="hidden text-foreground/35 md:inline">Catapult</span>
          <span className="hidden text-foreground/35 md:inline">Apollo</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1520px] flex-col gap-5">
        <FieldSessionHeader session={session} />
        <FieldAthleteCarousel
          players={effectivePlayers}
          selectedId={liveSelected.id}
          cardMetric={cardMetric}
          getMetricValue={cardMetricValue}
          onSelect={setSelectedId}
          onOpenSelected={openSelected}
          onMetricChange={setCardMetric}
        />
        <FieldValuationTabs
          valuation={valuation}
          valuations={valuations}
          onChange={changeValuation}
          onPreset={layers.applyPreset}
          layers={layers.layers}
          onToggleLayer={layers.toggleLayer}
          onOpenDetails={() => setDetailsOpen(true)}
        />

        <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar">
          {positionFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => changePositionFilter(filter)}
              className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                positionFilter === filter ? "bg-foreground text-background" : "bg-surface/55 text-foreground/45 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="flex min-w-0 flex-col gap-5">
            <FieldPitch
              players={effectivePlayers}
              selected={liveSelected}
              activeLayers={layers.activeLayers}
              live={isLive}
              onSelect={setSelectedId}
            />
            <FieldLegends layers={layers.layers} />
            <FieldTimeline
              minute={timeline.minute}
              playing={timeline.playing}
              followingLive={timeline.followingLive}
              events={timeline.events}
              onMinuteChange={timeline.setTimelineMinute}
              onPlayingChange={timeline.setPlaying}
              onReturnToLive={timeline.returnToLive}
            />
          </div>
          <FieldSidePanel
            selected={liveSelected}
            valuation={valuation}
            insights={insights}
            players={effectivePlayers}
            onInsight={(athleteId, nextValuation) => {
              setSelectedId(athleteId)
              changeValuation(nextValuation)
            }}
          />
        </section>

        <div className="flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.16em] text-foreground/35">
          <span className="flex items-center gap-2"><Radio className="size-3.5 text-alert" /> Fluxo: selecionar atleta</span>
          <span>selecionar valencia</span>
          <span>ver dado</span>
          <span>comparar</span>
          <span>criar decisao</span>
        </div>
      </div>

      <AnimatePresence>
        {detailsOpen && (
          <FieldValuationModal
            valuation={valuation}
            label={getValuation(valuation).label}
            selected={liveSelected}
            players={players}
            onClose={() => setDetailsOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
