"use client"

import { useMemo } from "react"
import { liveFieldPlayers, type FieldMode } from "@/lib/mock-field-session"

export function useLiveFieldData(mode: FieldMode = "live", minute = 42) {
  const players = useMemo(() => {
    if (mode === "session") return liveFieldPlayers
    const drift = Math.max(0, minute - 40)
    return liveFieldPlayers.map((player, index) => ({
      ...player,
      fieldPosition: {
        ...player.fieldPosition,
        x: Math.max(8, Math.min(92, player.fieldPosition.x + (index % 2 === 0 ? drift * 0.18 : -drift * 0.12))),
        y: Math.max(10, Math.min(90, player.fieldPosition.y + (index % 3 === 0 ? drift * 0.1 : -drift * 0.08))),
      },
    }))
  }, [mode, minute])

  return {
    players,
    isLive: mode === "live",
  }
}
