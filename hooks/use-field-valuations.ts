"use client"

import { fieldValuations, type FieldValuation } from "@/lib/mock-field-session"

export function useFieldValuations() {
  const getValuation = (id: FieldValuation) => fieldValuations.find((item) => item.id === id) ?? fieldValuations[0]

  return {
    valuations: fieldValuations,
    getValuation,
  }
}
