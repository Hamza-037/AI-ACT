import { describe, it, expect } from 'vitest'
import { OBLIGATION_CODES, OBLIGATION_LABELS, OBLIGATION_DEADLINES } from '@/types/shared.types'
import { calculerScore, calculerJoursRestants } from '@/lib/utils/conformite'

describe('Checklist — obligations', () => {
  it('contient exactement 8 obligations', () => {
    expect(OBLIGATION_CODES).toHaveLength(8)
  })

  it('ai_literacy est dans la liste', () => {
    expect(OBLIGATION_CODES).toContain('ai_literacy')
  })

  it('tous les codes ont un label', () => {
    OBLIGATION_CODES.forEach((code) => {
      expect(OBLIGATION_LABELS[code]).toBeTruthy()
    })
  })

  it('tous les codes ont une deadline', () => {
    OBLIGATION_CODES.forEach((code) => {
      expect(OBLIGATION_DEADLINES[code]).toBeTruthy()
    })
  })

  it('ai_literacy deadline contient 2025', () => {
    expect(OBLIGATION_DEADLINES.ai_literacy).toContain('2025')
  })

  it('les autres deadlines contiennent 2026', () => {
    const autresCodes = OBLIGATION_CODES.filter((c) => c !== 'ai_literacy')
    autresCodes.forEach((code) => {
      expect(OBLIGATION_DEADLINES[code]).toContain('2026')
    })
  })
})

describe('calculerScore', () => {
  it('retourne 0 si aucun item', () => {
    expect(calculerScore([])).toBe(0)
  })

  it('retourne 100 si tous conformes', () => {
    const items = [{ statut: 'conforme' }, { statut: 'conforme' }, { statut: 'conforme' }]
    expect(calculerScore(items)).toBe(100)
  })

  it('retourne 0 si aucun conforme', () => {
    const items = [{ statut: 'non_evalue' }, { statut: 'en_cours' }]
    expect(calculerScore(items)).toBe(0)
  })

  it('retourne 50 si la moitie est conforme', () => {
    const items = [{ statut: 'conforme' }, { statut: 'non_evalue' }]
    expect(calculerScore(items)).toBe(50)
  })

  it('arrondit correctement (2/3 = 67%)', () => {
    const items = [{ statut: 'conforme' }, { statut: 'conforme' }, { statut: 'non_evalue' }]
    expect(calculerScore(items)).toBe(67)
  })
})

describe('calculerJoursRestants', () => {
  it('retourne un nombre positif pour une deadline future', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)
    expect(calculerJoursRestants(future)).toBeGreaterThan(0)
  })

  it('retourne 0 pour une deadline passee', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24)
    expect(calculerJoursRestants(past)).toBe(0)
  })

  it('retourne une valeur positive pour le 2 aout 2026', () => {
    expect(calculerJoursRestants()).toBeGreaterThan(0)
  })
})
