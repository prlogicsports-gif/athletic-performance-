"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { fieldPlayers, type FieldMetric } from "@/lib/field-data"
import { spring } from "@/lib/motion"
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

  const selectPlayer = (id: string) => {
    setSelectedId(id)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#000000] text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={spring}
    >
      <div className="absolute left-4 top-4 z-50 flex items-center gap-3 md:left-8 md:top-6">
        {(["real", "model", "analytics"] as FieldStage[]).map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setStage(item)}
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground"
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
        className="absolute right-4 top-4 z-50 flex size-9 items-center justify-center rounded-full bg-surface/70 text-foreground/70 transition-colors hover:text-foreground md:right-8 md:top-6"
      >
        <X className="size-4" />
      </button>

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
