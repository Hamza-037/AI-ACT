import { describe, it, expect } from 'vitest'
import { PLAN_FEATURES, PLAN_PRICES, PLAN_NAMES } from '@/lib/plans/data'

describe('Plans data', () => {
  it('PLAN_FEATURES a 4 entrees', () => {
    expect(Object.keys(PLAN_FEATURES)).toHaveLength(4)
  })

  it('PLAN_PRICES a 4 entrees', () => {
    expect(Object.keys(PLAN_PRICES)).toHaveLength(4)
  })

  it('plan gratuit a un prix de 0', () => {
    expect(PLAN_PRICES.gratuit).toBe(0)
  })

  it('plan starter coute 99€', () => {
    expect(PLAN_PRICES.starter).toBe(99)
  })

  it('plan pro est plus cher que starter', () => {
    expect(PLAN_PRICES.pro).toBeGreaterThan(PLAN_PRICES.starter)
  })

  it('plan expert est plus cher que pro', () => {
    expect(PLAN_PRICES.expert).toBeGreaterThan(PLAN_PRICES.pro)
  })

  it('features pro contient AI Literacy', () => {
    const found = PLAN_FEATURES.pro.some((f) => f.toLowerCase().includes('literacy'))
    expect(found).toBe(true)
  })

  it('features gratuit ne contient pas AI Literacy', () => {
    const found = PLAN_FEATURES.gratuit.some((f) => f.toLowerCase().includes('literacy'))
    expect(found).toBe(false)
  })

  it('PLAN_NAMES a 4 entrees', () => {
    expect(Object.keys(PLAN_NAMES)).toHaveLength(4)
  })

  it('plan gratuit a un nom', () => {
    expect(PLAN_NAMES.gratuit).toBeTruthy()
  })
})
