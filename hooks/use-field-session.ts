"use client"

import { fieldInsights, fieldSession } from "@/lib/mock-field-session"

export function useFieldSession() {
  return {
    session: fieldSession,
    insights: fieldInsights,
  }
}
