import { describe, it, expect } from 'vitest'
import { OBLIGATION_LABELS, OBLIGATION_DEADLINES } from '@/types/shared.types'

describe('Types et constantes', () => {
  it('OBLIGATION_LABELS contient toutes les obligations', () => {
    expect(Object.keys(OBLIGATION_LABELS)).toHaveLength(8)
  })
  it('OBLIGATION_DEADLINES contient toutes les obligations', () => {
    expect(Object.keys(OBLIGATION_DEADLINES)).toHaveLength(8)
  })
  it('AI Literacy est déjà obligatoire', () => {
    expect(OBLIGATION_DEADLINES.ai_literacy).toContain('2025')
  })
})
