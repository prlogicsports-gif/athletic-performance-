"use client"

import { useState } from "react"
import { fieldTimelineEvents } from "@/lib/mock-field-session"

export function useFieldTimeline() {
  const [minute, setMinute] = useState(42)
  const [playing, setPlaying] = useState(false)
  const [followingLive, setFollowingLive] = useState(true)

  const setTimelineMinute = (next: number) => {
    setMinute(next)
    setFollowingLive(next >= 42)
  }

  const returnToLive = () => {
    setMinute(42)
    setFollowingLive(true)
  }

  return {
    minute,
    playing,
    followingLive,
    events: fieldTimelineEvents,
    setTimelineMinute,
    setPlaying,
    returnToLive,
  }
}
