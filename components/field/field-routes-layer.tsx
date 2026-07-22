"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

function path(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
}

export function FieldRoutesLayer({ player, recent = false }: { player: LiveFieldPlayer; recent?: boolean }) {
  const points = recent ? player.recentTrail : player.distanceTrail

  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.path
        d={path(points)}
        fill="none"
        stroke="var(--info)"
        strokeWidth={recent ? 1.2 : 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.86 }}
        transition={spring}
      />
      {points.map((point, index) => (
        <circle
          key={`${player.id}-route-${index}`}
          cx={point.x}
          cy={point.y}
          r={index === 0 || index === points.length - 1 ? 1.25 : 0.72}
          fill={index === 0 ? "var(--good)" : index === points.length - 1 ? "var(--foreground)" : "rgba(255,255,255,0.55)"}
        />
      ))}
    </motion.svg>
  )
}
