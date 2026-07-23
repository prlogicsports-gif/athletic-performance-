"use client"

import { useEffect, useMemo, useState } from "react"
import {
  defaultPlatformSettings,
  platformFeatures,
  type FeatureFlag,
  type PlatformSettings,
} from "@/lib/platform-settings"

const STORAGE_KEY = "athletic-platform-settings"
const SETTINGS_EVENT = "athletic-platform-settings-change"

function normalizeSettings(value: unknown): PlatformSettings {
  if (!value || typeof value !== "object") return defaultPlatformSettings

  return platformFeatures.reduce<PlatformSettings>(
    (settings, feature) => ({
      ...settings,
      [feature.id]:
        typeof (value as Partial<PlatformSettings>)[feature.id] === "boolean"
          ? Boolean((value as Partial<PlatformSettings>)[feature.id])
          : defaultPlatformSettings[feature.id],
    }),
    { ...defaultPlatformSettings },
  )
}

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultPlatformSettings)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const applyStoredSettings = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        setSettings(stored ? normalizeSettings(JSON.parse(stored)) : defaultPlatformSettings)
      } catch {
        setSettings(defaultPlatformSettings)
      }
    }

    applyStoredSettings()
    setReady(true)

    window.addEventListener(SETTINGS_EVENT, applyStoredSettings)
    return () => window.removeEventListener(SETTINGS_EVENT, applyStoredSettings)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [ready, settings])

  const writeSettings = (nextSettings: PlatformSettings) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))
    } catch {
      // Keep UI state responsive even if localStorage is unavailable.
    }
    setSettings(nextSettings)
    window.dispatchEvent(new Event(SETTINGS_EVENT))
  }

  const enabledFeatures = useMemo(
    () => platformFeatures.filter((feature) => settings[feature.id]),
    [settings],
  )

  const setFeature = (feature: FeatureFlag, enabled: boolean) => {
    writeSettings({ ...settings, [feature]: enabled })
  }

  const resetSettings = () => writeSettings(defaultPlatformSettings)

  return {
    settings,
    ready,
    enabledFeatures,
    setFeature,
    resetSettings,
  }
}
