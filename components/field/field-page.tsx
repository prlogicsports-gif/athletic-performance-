"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { valuations, getValuation } = useFieldValuations()
  const { selected, cardMetricValue } = useFieldAthletes(selectedId, cardMetric)
  const liveSelected = players.find((player) => player.id === selected.id) ?? selected
  const layers = useFieldLayers()

  const changeValuation = (next: FieldValuation) => {
    setValuation(next)
    const preset = valuationPresetMap[next]
    if (preset) layers.applyPreset(preset)
  }

  const openSelected = () => {
    if (onOpenAthlete) onOpenAthlete(selected.id)
    else setDetailsOpen(true)
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="min-h-screen bg-[#000000] px-4 pb-10 pt-14 text-foreground md:px-8 md:pt-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <FieldSessionHeader session={session} />
        <FieldAthleteCarousel
          players={players}
          selectedId={selected.id}
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
          onOpenDetails={() => setDetailsOpen(true)}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <FieldPitch
              players={players}
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
            onInsight={(athleteId, nextValuation) => {
              setSelectedId(athleteId)
              changeValuation(nextValuation)
            }}
          />
        </section>
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
