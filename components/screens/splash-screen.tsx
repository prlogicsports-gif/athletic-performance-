"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Screen } from "@/lib/nav"

export function SplashScreen({ onEnter }: { onEnter: (s: Screen) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onEnter("dashboard")}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
      transition={{ duration: 0.8 }}
      aria-label="Entrar no Performance Center"
    >
      <Image
        src="/splash-ac-runner.png"
        alt="Athletic Club"
        fill
        priority
        sizes="100vw"
        className="object-contain object-center"
      />
      <motion.span
        className="absolute bottom-8 text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        Toque para iniciar
      </motion.span>
    </motion.button>
  )
}
