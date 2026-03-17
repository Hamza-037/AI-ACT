'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'
import type { ActionResult } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function signIn(formData: FormData): Promise<ActionResult<void>> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { success: false, error: error.message }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Authentification échouée' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data: profile } = (await db
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null }

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  redirect('/dashboard')
}

export async function signUp(formData: FormData): Promise<ActionResult<void>> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { success: false, error: error.message }

  redirect('/onboarding')
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
