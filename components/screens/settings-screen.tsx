"use client"

import { motion } from "framer-motion"
import { Check, RotateCcw, SlidersHorizontal } from "lucide-react"
import { platformFeatures } from "@/lib/platform-settings"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { usePlatformSettings } from "@/hooks/use-platform-settings"

export function SettingsScreen() {
  const { settings, setFeature, resetSettings } = usePlatformSettings()

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="px-4 pb-16 pt-1 md:px-8"
    >
      <motion.div variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/45">
            Configuracoes
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
            Features da plataforma
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
            Ative ou pause modulos por clube, mantendo a experiencia atual sem remover telas.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={resetSettings}
          whileHover={{ y: -2, scale: 1.02 }}
          transition={spring}
          className="flex items-center gap-2 self-start text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground md:self-auto"
        >
          <RotateCcw className="size-4" strokeWidth={1.5} />
          Restaurar padrao
        </motion.button>
      </motion.div>

      <motion.div variants={staggerContainer} className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformFeatures.map((feature, index) => {
          const enabled = settings[feature.id]

          return (
            <motion.button
              key={feature.id}
              type="button"
              onClick={() => setFeature(feature.id, !enabled)}
              variants={staggerItem}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ ...spring, delay: index * 0.02 }}
              className={cn(
                "group relative min-h-[190px] overflow-hidden rounded-2xl bg-card/25 p-5 text-left transition-colors",
                enabled ? "text-foreground" : "text-foreground/45",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/[0.05] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="size-4" strokeWidth={1.5} />
                      <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/40">
                        {feature.stage}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full transition-colors",
                        enabled ? "bg-foreground text-background" : "bg-foreground/10 text-foreground/35",
                      )}
                    >
                      {enabled && <Check className="size-4" strokeWidth={2} />}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{feature.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/50">{feature.description}</p>
                </div>
                <span className="mt-6 text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
                  {enabled ? "Ativo" : "Pausado"}
                </span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
