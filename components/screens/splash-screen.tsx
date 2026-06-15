"use client"

import { motion } from "framer-motion"
import { AcLogo } from "../ac-logo"
import type { Screen } from "@/lib/nav"

export function SplashScreen({ onEnter }: { onEnter: (s: Screen) => void }) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute right-8 top-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-medium tracking-[0.25em] text-muted-foreground">POWERED BY</span>
          <div className="flex h-8 items-center justify-center rounded-[3px] bg-foreground px-2.5">
            <span className="font-mono text-lg font-black tracking-tighter text-background">PR</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.82, opacity: 0, filter: "blur(14px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
      >
        <AcLogo withRunner className="h-40 w-72 md:h-52 md:w-96" />
      </motion.div>

      <motion.div
        className="mt-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <h1 className="text-balance text-center text-sm font-semibold uppercase tracking-[0.5em] text-foreground">
          Performance Center
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Athletic Club</p>
      </motion.div>

      <motion.button
        onClick={() => onEnter("dashboard")}
        className="group mt-14 flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-wide text-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        ENTRAR
        <motion.span
          aria-hidden
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
        >
          →
        </motion.span>
      </motion.button>

      <motion.div
        className="absolute bottom-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="size-1.5 rounded-full bg-alert" />
        Sistema online • Temporada 2024
      </motion.div>
    </motion.div>
  )
}
