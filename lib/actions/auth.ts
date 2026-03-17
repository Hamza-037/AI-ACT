'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/shared.types'

export async function signIn(formData: FormData): Promise<ActionResult<void>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}

export async function signUp(formData: FormData): Promise<ActionResult<void>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}

export async function signOut(): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}
