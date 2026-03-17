import { z } from 'zod'

export const systemeIASchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(200),
  fournisseur: z.string().max(200).nullable().optional(),
  usage: z.string().max(1000).nullable().optional(),
  departement: z.string().max(100).nullable().optional(),
  niveau_risque: z.enum(['interdit', 'haut_risque', 'risque_limite', 'risque_minimal']),
  decisions_autonomes: z.boolean().default(false),
  responsable_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export type SystemeIAInput = z.infer<typeof systemeIASchema>
