"use client"

import type { FieldActionType, LiveFieldPlayer } from "@/lib/mock-field-session"
import { motion } from "framer-motion"
import { FieldMotionTrace } from "./field-motion-trace"

const colors: Record<FieldActionType, string> = {
  pass: "rgba(94,222,102,0.96)",
  reception: "rgba(94,222,102,0.86)",
  shot: "rgba(255,255,255,0.96)",
  recovery: "rgba(74,163,255,0.96)",
  turnover: "rgba(255,74,74,0.94)",
  pressure: "rgba(255,211,49,0.96)",
  duel: "rgba(255,142,45,0.96)",
  interception: "rgba(74,163,255,0.96)",
  tackle: "rgba(255,142,45,0.96)",
}

export function FieldActionsLayer({ player }: { player: LiveFieldPlayer }) {
  const points = player.actions.map((action) => ({ x: action.x, y: action.y }))

  return (
    <motion.svg viewBox="0 0 105 68" preserveAspectRatio="none" className="absolute inset-0 size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <FieldMotionTrace points={points} color="rgba(94,222,102,0.82)" pointColor="rgba(94,222,102,0.92)" width={0.92} />
      {player.actions.map((action) => {
        const color = colors[action.type]
        return (
          <g
            key={`${player.id}-action-${action.timestamp}-${action.type}`}
            aria-label={`${player.name} - ${action.label}`}
          >
            <circle cx={action.x * 1.05} cy={action.y * 0.68} r="1.55" fill="rgba(0,0,0,0.74)" stroke={color} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            <circle cx={action.x * 1.05} cy={action.y * 0.68} r="0.66" fill={color} />
          </g>
        )
      })}
    </motion.svg>
  )
}
