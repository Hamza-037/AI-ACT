'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteSystem } from '@/lib/actions/systemes'

type Props = {
  id: string
  nom: string
}

export function DeleteSystemeButton({ id, nom }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteSystem(id)
      if (!result.success) {
        setError(result.error)
        return
      }
      setOpen(false)
      router.push('/dashboard/registre')
    })
  }

  return (
    <>
      <Button
        variant="destructive"
        className="h-11"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce système</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer <strong>{nom}</strong>. Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" className="h-11" />}
            >
              Annuler
            </DialogClose>
            <Button
              variant="destructive"
              className="h-11"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Suppression...' : 'Confirmer la suppression'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
