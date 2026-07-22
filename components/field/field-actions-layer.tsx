"use client"

import { ArrowDownUp, CircleDot, Crosshair, Shield, Target, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { FieldActionType, LiveFieldPlayer } from "@/lib/mock-field-session"

const icons: Record<FieldActionType, LucideIcon> = {
  pass: ArrowDownUp,
  reception: CircleDot,
  shot: Target,
  recovery: Shield,
  turnover: X,
  pressure: Crosshair,
  duel: CircleDot,
  interception: Shield,
  tackle: Crosshair,
}

export function FieldActionsLayer({ player }: { player: LiveFieldPlayer }) {
  return (
    <div className="absolute inset-0">
      {player.actions.map((action) => {
        const Icon = icons[action.type]
        return (
          <button
            key={`${player.id}-action-${action.timestamp}-${action.type}`}
            type="button"
            title={`${player.name} - ${action.label}`}
            className="absolute z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground/80 backdrop-blur transition-colors hover:text-foreground"
            style={{ left: `${action.x}%`, top: `${action.y}%` }}
          >
            <Icon className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
