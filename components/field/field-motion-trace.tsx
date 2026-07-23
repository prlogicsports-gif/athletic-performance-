"use client"

import { motion } from "framer-motion"
import { spring } from "@/lib/motion"

type TracePoint = {
  x: number
  y: number
}

function smoothPath(points: TracePoint[]) {
  if (points.length < 2) return ""

  const scaled = points.map((point) => ({ x: point.x * 1.05, y: point.y * 0.68 }))

  return scaled.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`

    const previous = points[index - 1]
    const controlX = (previous.x + point.x) / 2
    const controlY = (previous.y + point.y) / 2

    return `${path} Q ${controlX} ${controlY} ${point.x} ${point.y}`
  }, "")
}

export function FieldMotionTrace({
  points,
  color = "rgba(94, 222, 102, 0.96)",
  pointColor,
  delay = 0,
  width = 1.05,
}: {
  points: TracePoint[]
  color?: string
  pointColor?: string
  delay?: number
  width?: number
}) {
  const d = smoothPath(points)
  if (!d) return null

  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.34)"
        strokeWidth={width * 0.72}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ ...spring, delay }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{ ...spring, delay: delay + 0.03 }}
      />
      {points.map((point, index) => (
        <motion.circle
          key={`${point.x}-${point.y}-${index}`}
          cx={point.x * 1.05}
          cy={point.y * 0.68}
          r={index === 0 || index === points.length - 1 ? 1.1 : 0.78}
          fill={index === points.length - 1 ? "rgba(255,255,255,0.95)" : pointColor ?? color}
          stroke="rgba(0,0,0,0.64)"
          strokeWidth="0.28"
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: delay + 0.04 + index * 0.025 }}
        />
      ))}
    </g>
  )
}
