"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { FieldMotionTrace } from "./field-motion-trace"

export function FieldSprintsLayer({ player }: { player: LiveFieldPlayer }) {
  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {player.sprints.map((point, index) => {
        const start = player.routes[index] ?? player.fieldPosition
        return (
          <g key={`${player.id}-sprint-${index}`}>
            <FieldMotionTrace
              points={[start, point]}
              color={index % 2 === 0 ? "rgba(255,211,49,0.98)" : "rgba(255,74,74,0.92)"}
              pointColor={index % 2 === 0 ? "rgba(255,211,49,0.98)" : "rgba(255,74,74,0.92)"}
              delay={index * 0.04}
              width={1.14}
            />
          </g>
        )
      })}
    </motion.svg>
  )
}
