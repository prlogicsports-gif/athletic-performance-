"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { softSpring } from "@/lib/motion"
import { FieldPage } from "./field-page"

export function AthleticFieldExperience({
  onClose,
  onOpenAthlete,
}: {
  onClose: () => void
  onOpenAthlete?: (id: string) => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#000000] text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={softSpring}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar visualizacao de campo"
        className="fixed right-4 top-4 z-[100] flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground/80 backdrop-blur-md transition-colors hover:text-foreground md:right-8 md:top-6"
      >
        <X className="size-4" />
      </button>
      <FieldPage onOpenAthlete={onOpenAthlete} />
    </motion.div>
  )
}
