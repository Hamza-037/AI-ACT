import { describe, it, expect } from 'vitest'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'
import { onboardingRequis } from '@/lib/utils/conformite'

describe('Schéma signIn (Zod)', () => {
  it('accepte des données valides', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: 'motdepasse123',
    })
    expect(result.success).toBe(true)
  })

  it('rejette un email invalide', () => {
    const result = signInSchema.safeParse({
      email: 'pas-un-email',
      password: 'motdepasse123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('invalide')
    }
  })

  it('rejette un mot de passe trop court', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: 'court',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('8')
    }
  })

  it('rejette un email vide', () => {
    const result = signInSchema.safeParse({
      email: '',
      password: 'motdepasse123',
    })
    expect(result.success).toBe(false)
  })

  it('rejette un mot de passe vide', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('Schéma signUp (Zod)', () => {
  it('accepte des données valides avec confirmation', () => {
    const result = signUpSchema.safeParse({
      email: 'nouveau@example.com',
      password: 'motdepasse123',
      confirmPassword: 'motdepasse123',
    })
    expect(result.success).toBe(true)
  })

  it('rejette si confirmPassword ne correspond pas', () => {
    const result = signUpSchema.safeParse({
      email: 'nouveau@example.com',
      password: 'motdepasse123',
      confirmPassword: 'autrechose456',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'))
      expect(confirmError).toBeDefined()
    }
  })

  it('rejette un email invalide', () => {
    const result = signUpSchema.safeParse({
      email: 'invalide',
      password: 'motdepasse123',
      confirmPassword: 'motdepasse123',
    })
    expect(result.success).toBe(false)
  })

  it('rejette un mot de passe trop court (< 8 chars)', () => {
    const result = signUpSchema.safeParse({
      email: 'test@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
  })
})

describe('Logique onboarding', () => {
  it('onboardingRequis retourne true si onboarding_completed est false', () => {
    expect(onboardingRequis(false)).toBe(true)
  })

  it('onboardingRequis retourne false si onboarding_completed est true', () => {
    expect(onboardingRequis(true)).toBe(false)
  })

  it('onboardingRequis retourne true si onboarding_completed est null', () => {
    expect(onboardingRequis(null)).toBe(true)
  })

  it('onboardingRequis retourne true si onboarding_completed est undefined', () => {
    expect(onboardingRequis(undefined)).toBe(true)
  })
})
