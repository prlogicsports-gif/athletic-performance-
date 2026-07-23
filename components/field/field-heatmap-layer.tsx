"use client"

import { motion } from "framer-motion"
import type { LiveFieldPlayer } from "@/lib/mock-field-session"
import { spring } from "@/lib/motion"

export function FieldHeatmapLayer({ player, live }: { player: LiveFieldPlayer; live: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: live ? 0.72 : 0.64 }}
      exit={{ opacity: 0 }}
      transition={spring}
    >
      {player.heatmapPoints.map((point, index) => (
        <span
          key={`${player.id}-heat-${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${120 + point.intensity * 170}px`,
            height: `${76 + point.intensity * 122}px`,
            opacity: 0.12 + point.intensity * 0.28,
            background:
              "radial-gradient(circle, rgba(255,34,34,0.88) 0%, rgba(255,211,49,0.72) 34%, rgba(85,220,104,0.34) 58%, rgba(33,155,255,0.14) 78%, transparent 100%)",
          }}
        />
      ))}
    </motion.div>
  )
}
