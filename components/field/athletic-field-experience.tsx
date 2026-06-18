"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { fieldPlayers, type FieldMetric } from "@/lib/field-data"
import { softSpring } from "@/lib/motion"
import { RealFieldView } from "./real-field-view"
import { Field3DView } from "./field-3d-view"
import { FieldAnalyticsView } from "./field-analytics-view"

export type FieldStage = "real" | "model" | "analytics"

export function AthleticFieldExperience({
  initialStage = "real",
  onClose,
}: {
  initialStage?: FieldStage
  onClose: () => void
}) {
  const [stage, setStage] = useState<FieldStage>(initialStage)
  const [selectedId, setSelectedId] = useState(fieldPlayers[0]?.id)
  const [metric, setMetric] = useState<FieldMetric>("heatmap")
  const showLogo = stage !== "real"

  const selectPlayer = (id: string) => {
    setSelectedId(id)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-[#000000] text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={softSpring}
    >
      <div className="absolute left-4 top-4 z-50 flex max-w-[calc(100vw-5.5rem)] items-center gap-3 rounded-full bg-background/55 px-3 py-2 backdrop-blur-md md:left-8 md:top-6">
        {(["real", "model", "analytics"] as FieldStage[]).map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setStage(item)}
            className="flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground md:text-[9px]"
          >
            <span className={stage === item ? "text-foreground" : ""}>0{index + 1}</span>
            <span className={stage === item ? "text-foreground" : ""}>
              {item === "real" ? "Real" : item === "model" ? "3D" : "Análise"}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar visualização de campo"
        className="absolute right-4 top-4 z-50 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground/70 backdrop-blur-md transition-colors hover:text-foreground md:right-8 md:top-6"
      >
        <X className="size-4" />
      </button>

      {showLogo && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-3 z-40 h-[68px] w-[68px] -translate-x-1/2 opacity-80 md:top-3 md:h-[92px] md:w-[92px]"
          initial={{ opacity: 0, scale: 0.92, y: -6 }}
          animate={{ opacity: 0.8, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={softSpring}
        >
          <Image src="/ac-logo-mark.png" alt="AC" fill sizes="92px" className="object-contain" priority />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {stage === "real" && <RealFieldView key="real" onNext={() => setStage("model")} />}
        {stage === "model" && (
          <Field3DView
            key={`model-${selectedId}`}
            selectedId={selectedId}
            onSelect={selectPlayer}
            onNext={() => setStage("analytics")}
          />
        )}
        {stage === "analytics" && (
          <FieldAnalyticsView
            key="analytics"
            selectedId={selectedId}
            metric={metric}
            onMetricChange={setMetric}
            onSelect={selectPlayer}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
