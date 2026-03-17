import { describe, it, expect } from 'vitest'
import { LITERACY_MODULES, getModuleById, calculateAttestationEligibility } from '@/lib/literacy/modules'

describe('LITERACY_MODULES', () => {
  it('contient exactement 3 modules', () => {
    expect(LITERACY_MODULES).toHaveLength(3)
  })

  it('les IDs sont module-1, module-2, module-3', () => {
    expect(LITERACY_MODULES.map((m) => m.id)).toEqual(['module-1', 'module-2', 'module-3'])
  })

  it('chaque module a une duree de 15 minutes', () => {
    LITERACY_MODULES.forEach((m) => {
      expect(m.duree_minutes).toBe(15)
    })
  })

  it('chaque module contient exactement 1 quiz', () => {
    LITERACY_MODULES.forEach((m) => {
      const quizzes = m.contenu.filter((c) => c.type === 'quiz')
      expect(quizzes).toHaveLength(1)
    })
  })

  it('chaque module contient exactement 1 texte', () => {
    LITERACY_MODULES.forEach((m) => {
      const texts = m.contenu.filter((c) => c.type === 'text')
      expect(texts).toHaveLength(1)
    })
  })

  it('les reponses correctes sont dans les plages valides', () => {
    LITERACY_MODULES.forEach((m) => {
      m.contenu.forEach((c) => {
        if (c.type === 'quiz') {
          expect(c.reponse_correcte).toBeGreaterThanOrEqual(0)
          expect(c.reponse_correcte).toBeLessThan(c.options.length)
        }
      })
    })
  })

  it('le module 1 concerne la date fevrier 2025', () => {
    const module1 = LITERACY_MODULES[0]
    const quiz = module1?.contenu.find((c) => c.type === 'quiz')
    if (quiz?.type === 'quiz') {
      expect(quiz.explication).toContain('2025')
    }
  })
})

describe('getModuleById', () => {
  it('retourne le bon module pour un ID valide', () => {
    const m = getModuleById('module-1')
    expect(m).toBeDefined()
    expect(m?.ordre).toBe(1)
  })

  it('retourne undefined pour un ID invalide', () => {
    expect(getModuleById('inexistant')).toBeUndefined()
  })
})

describe('calculateAttestationEligibility', () => {
  it('retourne true si les 3 modules sont completes', () => {
    expect(calculateAttestationEligibility(['module-1', 'module-2', 'module-3'])).toBe(true)
  })

  it('retourne false si un module manque', () => {
    expect(calculateAttestationEligibility(['module-1', 'module-2'])).toBe(false)
  })

  it('retourne false si la liste est vide', () => {
    expect(calculateAttestationEligibility([])).toBe(false)
  })
})
