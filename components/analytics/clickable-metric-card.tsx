"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { ReactNode } from "react"
import { getMetricAnalysis, type MetricAnalysis } from "@/lib/analytics-data"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import { DataSourceBadge } from "./data-source-badge"
import { MetricDetailDialog } from "./metric-detail-dialog"

export function ClickableMetricCard({
  analysisId,
  analysis,
  icon,
  label,
  value,
  unit,
  delta,
  tone,
  className,
}: {
  analysisId?: string
  analysis?: MetricAnalysis
  icon?: ReactNode
  label: string
  value: ReactNode
  unit?: string
  delta?: ReactNode
  tone?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const data = analysis ?? getMetricAnalysis(analysisId ?? "load")

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -4, scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={spring}
        title={`Abrir analise: ${data.title}`}
        className={cn("group flex min-w-0 flex-col gap-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-foreground/45", className)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors group-hover:text-foreground/75">
            {icon}
            <span className="truncate text-[10px] uppercase tracking-[0.14em]">{label}</span>
          </div>
          <ExternalLink className="size-3.5 shrink-0 text-foreground/25 transition-colors group-hover:text-foreground/60" strokeWidth={1.5} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold tracking-tight", tone)}>{value}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
        {delta && <span className="text-[11px] text-good">{delta}</span>}
        <DataSourceBadge provenance={data.provenance} compact />
      </motion.button>

      <AnimatePresence>
        {open && <MetricDetailDialog analysis={data} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
