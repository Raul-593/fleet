'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
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
import { updateTrailer } from '@/app/dashboard/vehicles/actions'

type Trailer = {
    id: string
    id_number: string
    status: string
}

export default function TrailerListAdmin({ trailers }: { trailers: Trailer[] }) {
    const [editingTrailer, setEditingTrailer] = useState<Trailer | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = (trailer: Trailer) => setEditingTrailer(trailer)
    const handleClose = () => setEditingTrailer(null)

    async function clientAction(formData: FormData) {
        if (!editingTrailer) return
        setIsSubmitting(true)
        const res = await updateTrailer(editingTrailer.id, formData)
        setIsSubmitting(false)
        if (res?.success) handleClose()
        else alert(res?.error || 'Error al actualizar el remolque')
    }

    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-y-auto w-full">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 w-full">
                        <TableRow>
                            <TableHead>Número de ID</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trailers.length > 0 ? (
                            trailers.map((trailer) => (
                                <TableRow key={trailer.id}>
                                    <TableCell className="font-medium">{trailer.id_number}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            trailer.status === 'available' ? 'bg-green-100 text-green-800' :
                                            trailer.status === 'in_route' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {trailer.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(trailer)}>
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    No hay remolques registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingTrailer} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Remolque</DialogTitle>
                        <DialogDescription>Modifica la información del remolque.</DialogDescription>
                    </DialogHeader>
                    {editingTrailer && (
                        <form action={clientAction} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="id_number">Número de ID</Label>
                                <Input id="id_number" name="id_number" defaultValue={editingTrailer.id_number} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={editingTrailer.status}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="available">Disponible (Available)</option>
                                    <option value="in_route">En Uso (In Route)</option>
                                    <option value="maintenance">Mantenimiento (Maintenance)</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
