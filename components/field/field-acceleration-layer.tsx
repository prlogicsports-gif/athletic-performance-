"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { FieldMotionTrace } from "./field-motion-trace"

export function FieldAccelerationLayer({ player, type }: { player: LiveFieldPlayer; type: "accelerations" | "decelerations" }) {
  const vectors = type === "accelerations" ? player.accelerations : player.decelerations
  const color = type === "accelerations" ? "rgba(94,222,102,0.96)" : "rgba(255,142,45,0.96)"

  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {vectors.slice(0, 4).map((vector, index) => (
        <g key={`${player.id}-${type}-${index}`}>
          <FieldMotionTrace
            points={[
              { x: vector.x, y: vector.y },
              { x: vector.x + vector.dx * 0.52, y: vector.y + vector.dy * 0.52 },
              { x: vector.x + vector.dx, y: vector.y + vector.dy },
            ]}
            color={color}
            pointColor={color}
            delay={index * 0.05}
            width={0.96}
          />
        </g>
      ))}
    </motion.svg>
  )
}
