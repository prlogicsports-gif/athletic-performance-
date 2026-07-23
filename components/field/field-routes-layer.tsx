"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

function path(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return ""
  return points.reduce((value, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const controlX = (previous.x + point.x) / 2
    const controlY = (previous.y + point.y) / 2 - (index % 2 === 0 ? 3 : -2)
    return `${value} Q ${controlX} ${controlY} ${point.x} ${point.y}`
  }, "")
}

export function FieldRoutesLayer({ player, recent = false }: { player: LiveFieldPlayer; recent?: boolean }) {
  const points = recent ? player.recentTrail : player.distanceTrail

  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <defs>
        <marker id={`arrow-${player.id}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="var(--info)" opacity="0.9" />
        </marker>
      </defs>
      <motion.path
        d={path(points)}
        fill="none"
        stroke="var(--info)"
        strokeWidth={recent ? 1.15 : 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#arrow-${player.id})`}
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
