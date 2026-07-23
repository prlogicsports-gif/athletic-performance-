"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { FieldMotionTrace } from "./field-motion-trace"

export function FieldShotsLayer({ player }: { player: LiveFieldPlayer }) {
  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {player.shots.map((shot, index) => {
        const color = shot.result === "gol" ? "rgba(94,222,102,0.96)" : shot.result === "defesa" ? "rgba(255,211,49,0.96)" : "rgba(255,74,74,0.94)"
        return (
          <g
            key={`${player.id}-shot-${index}`}
          >
            <FieldMotionTrace
              points={[
                { x: shot.x, y: shot.y },
                { x: (shot.x + shot.targetX) / 2, y: Math.max(8, Math.min(92, (shot.y + shot.targetY) / 2 - 3)) },
                { x: shot.targetX, y: shot.targetY },
              ]}
              color={color}
              pointColor={color}
              delay={index * 0.06}
              width={1}
            />
            <circle cx={shot.x} cy={shot.y} r="2" fill="rgba(0,0,0,0.74)" stroke={color} strokeWidth="0.52" vectorEffect="non-scaling-stroke" />
          </g>
        )
      })}
    </motion.svg>
  )
}
