import { describe, it, expect } from 'vitest'
import { canAddSysteme, canAddUtilisateur, canAccessDocuments, canAccessLiteracy } from '@/lib/guards/plans'

describe('canAddSysteme', () => {
  it('plan gratuit : interdit', () => {
    const result = canAddSysteme('gratuit', 0)
    expect(result.allowed).toBe(false)
    if (!result.allowed) expect(result.upgrade_to).toBe('starter')
  })

  it('plan starter : autorise si sous la limite (5)', () => {
    expect(canAddSysteme('starter', 4).allowed).toBe(true)
  })

  it('plan starter : bloque a 5 systemes', () => {
    const result = canAddSysteme('starter', 5)
    expect(result.allowed).toBe(false)
    if (!result.allowed) expect(result.upgrade_to).toBe('pro')
  })

  it('plan pro : toujours autorise (illimite)', () => {
    expect(canAddSysteme('pro', 9999).allowed).toBe(true)
  })

  it('plan expert : toujours autorise (illimite)', () => {
    expect(canAddSysteme('expert', 9999).allowed).toBe(true)
  })

  it('plan starter a 0 systemes : autorise', () => {
    expect(canAddSysteme('starter', 0).allowed).toBe(true)
  })
})

describe('canAddUtilisateur', () => {
  it('plan gratuit : bloque a 1 utilisateur', () => {
    const result = canAddUtilisateur('gratuit', 1)
    expect(result.allowed).toBe(false)
  })

  it('plan gratuit : autorise si 0 utilisateurs', () => {
    expect(canAddUtilisateur('gratuit', 0).allowed).toBe(true)
  })

  it('plan pro : autorise jusqu\'a 5 utilisateurs', () => {
    expect(canAddUtilisateur('pro', 4).allowed).toBe(true)
  })

  it('plan pro : bloque a 5 utilisateurs', () => {
    const result = canAddUtilisateur('pro', 5)
    expect(result.allowed).toBe(false)
    if (!result.allowed) expect(result.upgrade_to).toBe('expert')
  })

  it('plan expert : autorise jusqu\'a 20 utilisateurs', () => {
    expect(canAddUtilisateur('expert', 19).allowed).toBe(true)
  })
})

describe('canAccessDocuments', () => {
  it('plan gratuit : interdit', () => {
    const result = canAccessDocuments('gratuit')
    expect(result.allowed).toBe(false)
    if (!result.allowed) expect(result.upgrade_to).toBe('starter')
  })

  it('plan starter : autorise', () => {
    expect(canAccessDocuments('starter').allowed).toBe(true)
  })

  it('plan pro : autorise', () => {
    expect(canAccessDocuments('pro').allowed).toBe(true)
  })

  it('plan expert : autorise', () => {
    expect(canAccessDocuments('expert').allowed).toBe(true)
  })
})

describe('canAccessLiteracy', () => {
  it('plan gratuit : interdit', () => {
    expect(canAccessLiteracy('gratuit').allowed).toBe(false)
  })

  it('plan starter : interdit', () => {
    expect(canAccessLiteracy('starter').allowed).toBe(false)
  })

  it('plan pro : autorise', () => {
    expect(canAccessLiteracy('pro').allowed).toBe(true)
  })

  it('plan expert : autorise', () => {
    expect(canAccessLiteracy('expert').allowed).toBe(true)
  })
})
