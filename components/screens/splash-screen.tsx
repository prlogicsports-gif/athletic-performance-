"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Screen } from "@/lib/nav"

export function SplashScreen({ onEnter }: { onEnter: (s: Screen) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onEnter("dashboard")}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#000000]"
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
    </motion.button>
  )
}
