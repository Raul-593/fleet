'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRoute } from '@/app/dashboard/routes/actions'
import { Plus } from 'lucide-react'

export default function NewRouteDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const res = await createRoute(formData)
        setIsSubmitting(false)

        if (res?.success) {
            setOpen(false)
        } else {
            alert(res?.error || 'Error al crear la ruta')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Ruta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nueva Ruta</DialogTitle>
                    <DialogDescription>
                        Ingresa los detalles de la nueva ruta para el sistema
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Ruta</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ej. Ruta Norte - Principal"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="origin">Origen</Label>
                                <Input
                                    id="origin"
                                    name="origin"
                                    placeholder="Ciudad de Origen"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destination">Destino</Label>
                                <Input
                                    id="destination"
                                    name="destination"
                                    placeholder="Ciudad de Destino"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="distance_km">Distancia (km)</Label>
                                <Input
                                    id="distance_km"
                                    name="distance_km"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="standard_duration_minutes">Duración Estándar (min)</Label>
                                <Input
                                    id="standard_duration_minutes"
                                    name="standard_duration_minutes"
                                    type="number"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="active">Estado Inicial</Label>
                            <select
                                id="active"
                                name="active"
                                defaultValue="true"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="true">Activa</option>
                                <option value="false">Inactiva</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear Ruta'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
