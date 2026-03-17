import { z } from 'zod'

export const organizationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(200),
  siren: z
    .string()
    .regex(/^\d{9}$/, 'Le SIREN doit contenir 9 chiffres')
    .nullable()
    .optional(),
  secteur: z.string().max(100).nullable().optional(),
  taille_salaries: z.number().int().positive().nullable().optional(),
})

export type OrganizationInput = z.infer<typeof organizationSchema>
