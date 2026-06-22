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
      <motion.div
        className="absolute bottom-14 flex flex-col items-center gap-1 text-center md:bottom-16"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.6 }}
      >
        <span className="text-[6px] font-medium uppercase leading-none tracking-[0.2em] text-foreground/30 md:text-[7px]">
          Powered by
        </span>
        <Image
          src="/pr-logo-solid.png"
          alt="PR Logic Sports"
          width={96}
          height={64}
          className="h-auto w-14 object-contain opacity-75 md:w-16"
        />
        <span className="text-[6px] font-semibold uppercase leading-none tracking-[0.18em] text-foreground/45 md:text-[7px]">
          PR Logic Sports
        </span>
      </motion.div>
      <motion.span
        className="absolute bottom-5 text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/45 md:bottom-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ delay: 1.1, duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
      >
        Toque para iniciar
      </motion.span>
    </motion.button>
  )
}
