import { describe, it, expect } from 'vitest'
import { classifierSysteme } from '@/lib/utils/classifier'

describe('classifierSysteme', () => {
  // Cas interdits
  it('Notation sociale → interdit', () => {
    expect(
      classifierSysteme({ nom: 'Notation sociale clients', decisions_autonomes: false })
    ).toBe('interdit')
  })

  it('Score social → interdit', () => {
    expect(
      classifierSysteme({ nom: 'Score social employés', decisions_autonomes: false })
    ).toBe('interdit')
  })

  it('Biométrie temps réel → interdit', () => {
    expect(
      classifierSysteme({ nom: 'Système biométrie temps réel', decisions_autonomes: false })
    ).toBe('interdit')
  })

  it('Surveillance de masse → interdit', () => {
    expect(
      classifierSysteme({ nom: 'Outil surveillance de masse', decisions_autonomes: false })
    ).toBe('interdit')
  })

  // Haut risque — RH
  it('Workday Recruiting + decisions_autonomes=true → haut_risque', () => {
    expect(
      classifierSysteme({
        nom: 'Workday Recruiting',
        fournisseur: 'Workday',
        decisions_autonomes: true,
      })
    ).toBe('haut_risque')
  })

  it('Eightfold AI recrutement + decisions_autonomes=true → haut_risque', () => {
    expect(
      classifierSysteme({
        nom: 'Eightfold AI',
        usage: 'Tri de candidats et recrutement',
        decisions_autonomes: true,
      })
    ).toBe('haut_risque')
  })

  it('Outil RH sans décisions autonomes → risque_minimal (pas haut_risque)', () => {
    // "rh" est dans le nom mais decisions_autonomes=false → pas haut risque
    expect(
      classifierSysteme({
        nom: 'Outil RH interne',
        decisions_autonomes: false,
      })
    ).toBe('risque_minimal')
  })

  // Haut risque — Finance
  it('Scoring crédit + decisions_autonomes=true → haut_risque', () => {
    expect(
      classifierSysteme({
        nom: 'Système scoring crédit',
        decisions_autonomes: true,
      })
    ).toBe('haut_risque')
  })

  it('Assurance + decisions_autonomes=true → haut_risque', () => {
    expect(
      classifierSysteme({
        nom: 'Moteur de décision assurance',
        decisions_autonomes: true,
      })
    ).toBe('haut_risque')
  })

  // Risque limité
  it('Microsoft Copilot → risque_limite', () => {
    expect(
      classifierSysteme({
        nom: 'Microsoft Copilot',
        fournisseur: 'Microsoft',
        decisions_autonomes: false,
      })
    ).toBe('risque_limite')
  })

  it('ChatGPT Enterprise → risque_limite', () => {
    expect(
      classifierSysteme({
        nom: 'ChatGPT Enterprise',
        fournisseur: 'OpenAI',
        decisions_autonomes: false,
      })
    ).toBe('risque_limite')
  })

  it('Chatbot support client → risque_limite', () => {
    expect(
      classifierSysteme({
        nom: 'Chatbot support',
        usage: 'Réponse automatique aux questions clients',
        decisions_autonomes: false,
      })
    ).toBe('risque_limite')
  })

  it('Assistant LLM → risque_limite', () => {
    expect(
      classifierSysteme({ nom: 'LLM interne', decisions_autonomes: false })
    ).toBe('risque_limite')
  })

  // Risque minimal
  it('Notion AI → risque_minimal', () => {
    expect(
      classifierSysteme({
        nom: 'Notion AI',
        fournisseur: 'Notion',
        decisions_autonomes: false,
      })
    ).toBe('risque_minimal')
  })

  it('Grammarly Business → risque_minimal', () => {
    expect(
      classifierSysteme({
        nom: 'Grammarly Business',
        fournisseur: 'Grammarly',
        decisions_autonomes: false,
      })
    ).toBe('risque_minimal')
  })

  it('Outil interne sans mots-clés → risque_minimal', () => {
    expect(
      classifierSysteme({
        nom: 'Outil de planification',
        fournisseur: 'Interne',
        decisions_autonomes: false,
      })
    ).toBe('risque_minimal')
  })
})
