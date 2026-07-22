"use client"

import { useMemo } from "react"
import { liveFieldPlayers, type FieldCardMetric } from "@/lib/mock-field-session"

export function useFieldAthletes(selectedId?: string, cardMetric: FieldCardMetric = "load") {
  const athletes = liveFieldPlayers
  const selected = athletes.find((player) => player.id === selectedId) ?? athletes[0]
  const activeIndex = Math.max(0, athletes.findIndex((player) => player.id === selected.id))

  const cardMetricValue = useMemo(() => {
    return (id: string) => {
      const player = athletes.find((item) => item.id === id) ?? athletes[0]
      if (cardMetric === "distance") return `${player.catapult.distance.toFixed(1)} km`
      if (cardMetric === "distancePerMinute") return `${player.distancePerMinute.toFixed(2)} km/min`
      if (cardMetric === "maxSpeed") return `${player.catapult.maxSpeed.toFixed(1)} km/h`
      if (cardMetric === "sprints") return `${player.catapult.sprints} spr`
      if (cardMetric === "heartRate") return `${player.heartRate.current} bpm`
      if (cardMetric === "recovery") return `${player.apollo.recovery}%`
      if (cardMetric === "target") return `${player.targetPct}% meta`
      return `${player.loadPct}% carga`
    }
  }, [athletes, cardMetric])

  return {
    athletes,
    selected,
    activeIndex,
    cardMetricValue,
  }
}
