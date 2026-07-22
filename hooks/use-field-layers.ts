"use client"

import { useMemo, useState } from "react"
import { fieldPresets, type FieldLayer, type FieldPreset } from "@/lib/mock-field-session"

const initialLayers: FieldLayer[] = ["markers", "heatmap", "routes"]

export function useFieldLayers() {
  const [layers, setLayers] = useState<FieldLayer[]>(initialLayers)

  const activeLayers = useMemo(() => new Set(layers), [layers])

  const toggleLayer = (layer: FieldLayer) => {
    if (layer === "markers") return
    setLayers((current) => (
      current.includes(layer)
        ? current.filter((item) => item !== layer)
        : [...current, layer]
    ))
  }

  const applyPreset = (preset: FieldPreset) => {
    const next = fieldPresets.find((item) => item.id === preset)
    if (next) setLayers(next.layers)
  }

  return {
    layers,
    activeLayers,
    toggleLayer,
    applyPreset,
  }
}
