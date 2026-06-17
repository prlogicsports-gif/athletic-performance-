"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { softSpring } from "@/lib/motion"

const REAL_FIELD_IMAGE = "/athletic-aerial-field.png"

export function RealFieldView({ onNext }: { onNext: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onNext}
      layoutId="athletic-field-surface"
      className="relative min-h-screen w-full overflow-hidden bg-[#000000] text-left"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04, rotateX: 5, x: -44, filter: "blur(6px)" }}
      transition={softSpring}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1.08, opacity: 0.22, x: -48 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={REAL_FIELD_IMAGE}
          alt="Campo Athletic"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75 contrast-110 saturate-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-background/35" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="absolute bottom-8 left-6 right-6 flex flex-wrap items-end justify-between gap-5 md:bottom-10 md:left-10 md:right-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.12 }}
      >
        <div>
          <span className="text-[9px] uppercase tracking-[0.28em] text-foreground/40">Visualização de campo</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">Campo Athletic</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/70">
          Clicar para abrir
        </span>
      </motion.div>
    </motion.button>
  )
}
