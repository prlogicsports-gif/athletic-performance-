"use client"

import { Circle, Triangle, X } from "lucide-react"
import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

export function FieldShotsLayer({ player }: { player: LiveFieldPlayer }) {
  return (
    <div className="absolute inset-0">
      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {player.shots.map((shot, index) => (
          <motion.path
            key={`${player.id}-shot-line-${index}`}
            d={`M ${shot.x} ${shot.y} L ${shot.targetX} ${shot.targetY}`}
            fill="none"
            stroke={shot.result === "gol" ? "var(--good)" : shot.result === "defesa" ? "var(--warn)" : "var(--alert)"}
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ ...spring, delay: index * 0.06 }}
          />
        ))}
      </motion.svg>
      {player.shots.map((shot, index) => {
        const Icon = shot.result === "gol" ? Circle : shot.result === "defesa" ? Triangle : X
        return (
          <button
            key={`${player.id}-shot-${index}`}
            type="button"
            title={`${player.name} - ${shot.result}`}
            className="absolute z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/75 text-foreground backdrop-blur"
            style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
          >
            <Icon className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
