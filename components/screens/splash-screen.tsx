"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Screen } from "@/lib/nav"
import { softSpring } from "@/lib/motion"

export function SplashScreen({ onEnter }: { onEnter: (s: Screen) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onEnter("dashboard")}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.9 }}
      aria-label="Entrar no Performance Center"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/splash-ac-runner.png"
          alt="Athletic Club"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />
      </motion.div>
      <motion.span
        className="absolute bottom-16 text-[7px] font-semibold uppercase tracking-[0.28em] text-foreground/25 md:text-[8px]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.6 }}
      >
        Powered by PR Logic Sports
      </motion.span>
      <motion.span
        className="absolute bottom-8 text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ delay: 1.1, duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
      >
        Toque para iniciar
      </motion.span>
    </motion.button>
  )
}
