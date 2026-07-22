"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

export function FieldAccelerationLayer({ player, type }: { player: LiveFieldPlayer; type: "accelerations" | "decelerations" }) {
  const vectors = type === "accelerations" ? player.accelerations : player.decelerations
  const color = type === "accelerations" ? "var(--good)" : "var(--warn)"

  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {vectors.slice(0, 4).map((vector, index) => (
        <g key={`${player.id}-${type}-${index}`}>
          <motion.path
            d={`M ${vector.x} ${vector.y} L ${vector.x + vector.dx} ${vector.y + vector.dy}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.82 }}
            transition={{ ...spring, delay: index * 0.05 }}
          />
          <circle cx={vector.x + vector.dx} cy={vector.y + vector.dy} r="1" fill={color} />
        </g>
      ))}
    </motion.svg>
  )
}
