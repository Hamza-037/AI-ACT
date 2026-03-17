# Templates Server Actions — aiactio

Templates complets prets a copier. Remplacer les noms en MAJUSCULES.

## Template CRUD complet

```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ActionResult } from '@/types/shared.types'

// Schema Zod — toujours valider les entrees
const createSchema = z.object({
  nom: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
})

// CREATE
export async function createRESOURCE(formData: FormData): Promise<ActionResult<RESOURCE>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  // Guard plan si limite applicable
  // const { allowed, reason } = await canAddRESOURCE(orgId)
  // if (!allowed) return { success: false, error: reason }

  const parsed = createSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { data, error } = await (supabase as unknown as DbClient)
    .from('RESOURCES')
    .insert({ user_id: user.id, ...parsed.data })
    .select()
    .single()

  if (error) return { success: false, error: 'Erreur serveur' }
  revalidatePath('/dashboard/RESOURCES')
  return { success: true, data: data as RESOURCE }
}

// UPDATE
export async function updateRESOURCE(id: string, formData: FormData): Promise<ActionResult<RESOURCE>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const parsed = createSchema.partial().safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  // RLS verifie user_id automatiquement — pas besoin de WHERE user_id=...
  const { data, error } = await (supabase as unknown as DbClient)
    .from('RESOURCES')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: 'Erreur serveur' }
  revalidatePath('/dashboard/RESOURCES')
  return { success: true, data: data as RESOURCE }
}

// DELETE
export async function deleteRESOURCE(id: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const { error } = await (supabase as unknown as DbClient)
    .from('RESOURCES')
    .delete()
    .eq('id', id)
  // RLS garantit que l'user ne peut supprimer que ses propres ressources

  if (error) return { success: false, error: 'Erreur serveur' }
  revalidatePath('/dashboard/RESOURCES')
  return { success: true, data: undefined }
}
```

## Template action avec appel OpenRouter

```typescript
'use server'
import { createServerClient } from '@/lib/supabase/server'
import { callOpenRouter } from '@/lib/ai/openrouter'
import { logAiUsage } from '@/lib/ai/logger'
import type { ActionResult } from '@/types/shared.types'

export async function analyzeWithAI(input: string): Promise<ActionResult<string>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const response = await callOpenRouter({
    model: 'google/gemini-2.5-flash',
    messages: [{ role: 'user', content: input }],
    maxTokens: 2000,
  })

  // Fire-and-forget — jamais await
  void logAiUsage({
    userId: user.id,
    model: 'google/gemini-2.5-flash',
    task: 'analyze',
    tokensUsed: response.usage?.total_tokens ?? 0,
  })

  return { success: true, data: response.choices[0].message.content }
}
```
