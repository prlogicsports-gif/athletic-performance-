"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/* ---------- Donut (load distribution) ---------- */
export function DonutLoad({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: { pct: number; token: string }[]
  centerValue: string
  centerLabel: string
}) {
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="relative size-32">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        {segments.map((s, i) => {
          const len = (s.pct / 100) * c
          const dash = `${len} ${c - len}`
          const el = (
            <motion.circle
              key={i}
              cx={60}
              cy={60}
              r={r}
              fill="none"
              stroke={`var(--${s.token})`}
              strokeWidth={14}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none">{centerValue}</span>
        <span className="text-[10px] tracking-widest text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  )
}

/* ---------- Horizontal progress bar ---------- */
export function Bar({
  pct,
  token = "good",
  className,
  delay = 0,
}: {
  pct: number
  token?: string
  className?: string
  delay?: number
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: `var(--${token})` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, delay, ease: "easeOut" }}
      />
    </div>
  )
}

/* ---------- Ring (single percentage) ---------- */
export function Ring({
  pct,
  token = "good",
  size = 92,
}: {
  pct: number
  token?: string
  size?: number
}) {
  const r = size / 2 - 6
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={5} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`var(--${token})`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{pct}%</span>
      </div>
    </div>
  )
}

/* ---------- Line chart (accumulated load) ---------- */
export function LineChart({
  now,
  prev,
  days,
}: {
  now: number[]
  prev: number[]
  days: string[]
}) {
  const w = 320
  const h = 130
  const max = Math.max(...now, ...prev) * 1.1
  const pad = 8
  const toPath = (data: number[]) =>
    data
      .map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2)
        const y = h - pad - (v / max) * (h - pad * 2)
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <motion.path
          d={toPath(prev)}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.path
          d={toPath(now)}
          fill="none"
          stroke="var(--good)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4 }}
        />
        {now.map((v, i) => {
          const x = pad + (i / (now.length - 1)) * (w - pad * 2)
          const y = h - pad - (v / max) * (h - pad * 2)
          return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--good)" />
        })}
      </svg>
      <div className="mt-1 flex justify-between px-1 text-[10px] text-muted-foreground">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}
