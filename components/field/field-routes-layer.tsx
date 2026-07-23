"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { FieldMotionTrace } from "./field-motion-trace"

export function FieldRoutesLayer({ player, recent = false }: { player: LiveFieldPlayer; recent?: boolean }) {
  const points = recent ? player.recentTrail : player.distanceTrail

  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <FieldMotionTrace
        points={points}
        color="rgba(94,222,102,0.96)"
        pointColor="rgba(94,222,102,0.96)"
        width={recent ? 1.18 : 1.02}
      />
    </motion.svg>
  )
}
