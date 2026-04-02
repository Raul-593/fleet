'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateRoute } from '@/app/dashboard/routes/actions'

type Route = {
    id: string
    name: string
    origin: string
    tanquear: string
    destination: string
    distance_km: number
    standard_duration_minutes: number
    active: boolean
}

export default function RouteListAdmin({ routes }: { routes: Route[] }) {
    const [editingRoute, setEditingRoute] = useState<Route | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = (route: Route) => {
        setEditingRoute(route)
    }

    const handleClose = () => {
        setEditingRoute(null)
    }

    async function clientAction(formData: FormData) {
        if (!editingRoute) return

        setIsSubmitting(true)
        const res = await updateRoute(editingRoute.id, formData)

        setIsSubmitting(false)
        if (res?.success) {
            toast.success('Ruta actualizada correctamente')
            handleClose()
        } else {
            toast.error(res?.error || 'Error al actualizar la ruta')
        }
    }

    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-y-auto w-full">
                <Table>
                    <TableCaption>Lista de rutas disponibles.</TableCaption>
                    <TableHeader className="sticky top-0 bg-background z-10 w-full">
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead>Destino</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Tanquear (Galones)</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Distancia (km)</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Duración (min)</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes && routes.length > 0 ? (
                            routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>{route.name}</TableCell>
                                    <TableCell>{route.origin}</TableCell>
                                    <TableCell>{route.destination}</TableCell>
                                    <TableCell className="text-right hidden md:table-cell">{route.tanquear}</TableCell>
                                    <TableCell className="text-right hidden md:table-cell">{route.distance_km}</TableCell>
                                    <TableCell className="text-right hidden md:table-cell">{route.standard_duration_minutes}</TableCell>
                                    <TableCell className="text-right hidden sm:table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${route.active
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                            {route.active ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(route)}
                                        >
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No hay rutas registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Dialog open={!!editingRoute} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Ruta</DialogTitle>
                        <DialogDescription>
                            Modifica la información de la ruta. Guarda los cambios al finalizar.
                        </DialogDescription>
                    </DialogHeader>

                    {editingRoute && (
                        <form action={clientAction} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={editingRoute.name}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="origin">Origen</Label>
                                    <Input
                                        id="origin"
                                        name="origin"
                                        defaultValue={editingRoute.origin}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="destination">Destino</Label>
                                    <Input
                                        id="destination"
                                        name="destination"
                                        defaultValue={editingRoute.destination}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanquear">Tanquear (Galones)</Label>
                                    <Input
                                        id="tanquear"
                                        name="tanquear"
                                        defaultValue={editingRoute.tanquear}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="distance_km">Distancia(Km)</Label>
                                    <Input
                                        id="distance_km"
                                        name="distance_km"
                                        defaultValue={editingRoute.distance_km}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="standard_duration_minutes">Tiempo Estimado (Minutos)</Label>
                                    <Input
                                        id="standard_duration_minutes"
                                        name="standard_duration_minutes"
                                        defaultValue={editingRoute.standard_duration_minutes}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="active">Estado de la Ruta</Label>
                                    <select
                                        id="active"
                                        name="active"
                                        defaultValue={editingRoute.active.toString()}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="true">Activa</option>
                                        <option value="false">Inactiva</option>
                                    </select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
