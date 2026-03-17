import { describe, it, expect } from 'vitest'
import { calculateResult, QUIZ_QUESTIONS } from '@/components/quiz/QuizWizard'

describe('QUIZ_QUESTIONS', () => {
  it('contient exactement 5 questions', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(5)
  })

  it('contient la question sur la taille de l\'entreprise', () => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === 'taille')
    expect(q).toBeDefined()
  })

  it('contient la question sur les outils IA RH', () => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === 'rh_ia')
    expect(q).toBeDefined()
  })

  it('contient la question sur le scoring client', () => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === 'scoring')
    expect(q).toBeDefined()
  })

  it('contient la question sur le chatbot', () => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === 'chatbot')
    expect(q).toBeDefined()
  })

  it('contient la question sur l\'usage quotidien IA', () => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === 'copilot')
    expect(q).toBeDefined()
  })

  it('chaque question a des options avec un risque_score numérique', () => {
    for (const question of QUIZ_QUESTIONS) {
      expect(question.options.length).toBeGreaterThan(0)
      for (const option of question.options) {
        expect(typeof option.risque_score).toBe('number')
      }
    }
  })
})

describe('calculateResult', () => {
  it('retourne niveau faible pour un score total de 0', () => {
    const result = calculateResult([0, 0, 0, 0, 0])
    expect(result.niveau).toBe('faible')
  })

  it('retourne niveau faible pour un score total de 4', () => {
    const result = calculateResult([1, 1, 1, 1, 0])
    expect(result.niveau).toBe('faible')
  })

  it('retourne niveau modere pour un score total de 5', () => {
    const result = calculateResult([2, 1, 1, 1, 0])
    expect(result.niveau).toBe('modere')
  })

  it('retourne niveau modere pour un score total de 9', () => {
    const result = calculateResult([2, 2, 2, 2, 1])
    expect(result.niveau).toBe('modere')
  })

  it('retourne niveau eleve pour un score total de 10', () => {
    const result = calculateResult([2, 2, 2, 2, 2])
    expect(result.niveau).toBe('eleve')
  })

  it('retourne niveau eleve pour un score total élevé (18)', () => {
    const result = calculateResult([3, 5, 5, 4, 1])
    expect(result.niveau).toBe('eleve')
  })

  it('le niveau faible inclut une obligation AI Literacy', () => {
    const result = calculateResult([0, 0, 0, 0, 0])
    expect(result.obligations.length).toBeGreaterThan(0)
    expect(result.obligations.some((o) => o.toLowerCase().includes('literacy'))).toBe(true)
  })

  it('le niveau eleve inclut 4 obligations', () => {
    const result = calculateResult([3, 5, 5, 4, 3])
    expect(result.obligations).toHaveLength(4)
  })

  it('le niveau modere inclut 2 obligations', () => {
    const result = calculateResult([2, 1, 1, 1, 0])
    expect(result.obligations).toHaveLength(2)
  })

  it('le message est une chaîne non vide pour chaque niveau', () => {
    const scores = [
      [0, 0, 0, 0, 0],
      [2, 1, 1, 1, 0],
      [3, 5, 5, 4, 3],
    ]
    for (const s of scores) {
      const result = calculateResult(s)
      expect(typeof result.message).toBe('string')
      expect(result.message.length).toBeGreaterThan(0)
    }
  })
})
