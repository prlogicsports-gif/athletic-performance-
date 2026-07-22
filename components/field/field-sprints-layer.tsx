"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

export function FieldSprintsLayer({ player }: { player: LiveFieldPlayer }) {
  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {player.sprints.map((point, index) => {
        const start = player.routes[index] ?? player.fieldPosition
        return (
          <g key={`${player.id}-sprint-${index}`}>
            <motion.path
              d={`M ${start.x} ${start.y} L ${point.x} ${point.y}`}
              fill="none"
              stroke="var(--alert)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.88 }}
              transition={{ ...spring, delay: index * 0.04 }}
            />
            <circle cx={start.x} cy={start.y} r="0.8" fill="var(--foreground)" />
            <circle cx={point.x} cy={point.y} r="1.25" fill="var(--alert)" />
          </g>
        )
      })}
    </motion.svg>
  )
}
