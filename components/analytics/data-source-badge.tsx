"use client"

import { Database } from "lucide-react"
import type { DataProvenance } from "@/lib/analytics-data"
import { cn } from "@/lib/utils"

const qualityLabel: Record<DataProvenance["qualityStatus"], string> = {
  valid: "valida",
  partial: "parcial",
  delayed: "atrasada",
  estimated: "estimada",
  invalid: "invalida",
  mock: "simulada",
}

export function DataSourceBadge({
  provenance,
  compact = false,
}: {
  provenance: DataProvenance
  compact?: boolean
}) {
  return (
    <span
      title={`Origem: ${provenance.sourceLabel}. Qualidade: ${qualityLabel[provenance.qualityStatus]}. Atualizado: ${provenance.updatedAt}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-surface/65 text-foreground/50 transition-colors hover:text-foreground",
        compact ? "px-2 py-0.5 text-[8px]" : "px-2.5 py-1 text-[9px]",
      )}
    >
      <Database className="size-3" strokeWidth={1.5} />
      {provenance.qualityStatus === "mock" ? "Dados simulados" : provenance.sourceLabel}
    </span>
  )
}
