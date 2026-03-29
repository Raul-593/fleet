'use client'

import { useState } from 'react'
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
import { Trash2 } from 'lucide-react'
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
import { updateRouteAssignment, deleteRouteAssignment } from '@/app/dashboard/routes/actions'

type Assignment = {
    id: string
    company_route_id: string
    truck_id: string
    trailer_id: string | null
    driver_id: string
    departure_datetime: string
    arrival_datetime: string
    carga_time: string
    folio: string | null
    status: string
    company_routes?: { name: string } | null
    trucks?: { plate_number: string } | null
    trailer?: { id_number: string } | null
    drivers?: { first_name: string } | null
}

type DropdownItem = { id: string; label: string }

export default function RouteAssignmentsAdmin({
    assignments,
    routes,
    trucks,
    trailers,
    drivers
}: {
    assignments: Assignment[]
    routes: DropdownItem[]
    trucks: DropdownItem[]
    trailers: DropdownItem[]
    drivers: DropdownItem[]
}) {
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = (assignment: Assignment) => {
        setEditingAssignment(assignment)
    }

    const handleDeleteClick = (id: string) => {
        setDeletingId(id)
    }

    const handleClose = () => {
        setEditingAssignment(null)
        setDeletingId(null)
    }

    async function handleEditSubmit(formData: FormData) {
        if (!editingAssignment) return

        setIsSubmitting(true)
        const res = await updateRouteAssignment(editingAssignment.id, formData)

        setIsSubmitting(false)
        if (res?.success) {
            handleClose()
        } else {
            alert(res?.error || 'Error al actualizar la asignación')
        }
    }

    async function handleDeleteConfirm() {
        if (!deletingId) return

        setIsSubmitting(true)
        const res = await deleteRouteAssignment(deletingId)

        setIsSubmitting(false)
        if (res?.success) {
            handleClose()
        } else {
            alert(res?.error || 'Error al eliminar la asignación')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-MX', {
            dateStyle: 'short',
            timeStyle: 'short',
        })
    }

    const toDatetimeLocal = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString().slice(0, 16)
    }

    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-y-auto w-full rounded-md border">
                <Table>
                    <TableCaption>Lista de asignaciones de ruta.</TableCaption>
                    <TableHeader className="sticky top-0 bg-background z-10 w-full shadow-sm">
                        <TableRow>
                            <TableHead>Ruta</TableHead>
                            <TableHead>Camión</TableHead>
                            <TableHead>Remolque</TableHead>
                            <TableHead>Conductor</TableHead>
                            <TableHead>Carga</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Llegada</TableHead>
                            <TableHead>Folio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments && assignments.length > 0 ? (
                            assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell>{assignment.company_routes?.name || '-'}</TableCell>
                                    <TableCell>{assignment.trucks?.plate_number || '-'}</TableCell>
                                    <TableCell>{assignment.trailer?.id_number || '-'}</TableCell>
                                    <TableCell>{assignment.drivers?.first_name || '-'}</TableCell>
                                    <TableCell>{formatDate(assignment.carga_time)}</TableCell>
                                    <TableCell>{formatDate(assignment.departure_datetime)}</TableCell>
                                    <TableCell>{formatDate(assignment.arrival_datetime)}</TableCell>
                                    <TableCell>{assignment.folio || '-'}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {assignment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(assignment)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(assignment.id)}
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                    No hay asignaciones registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Dialog open={!!editingAssignment} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Asignación</DialogTitle>
                        <DialogDescription>
                            Modifica los datos de la asignación.
                        </DialogDescription>
                    </DialogHeader>

                    {editingAssignment && (
                        <form action={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_route_id">Ruta de Empresa</Label>
                                    <select
                                        id="company_route_id"
                                        name="company_route_id"
                                        defaultValue={editingAssignment.company_route_id}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Selecciona...</option>
                                        {routes.map(r => (
                                            <option key={r.id} value={r.id}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="truck_id">Camión</Label>
                                    <select
                                        id="truck_id"
                                        name="truck_id"
                                        defaultValue={editingAssignment.truck_id}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Selecciona...</option>
                                        {trucks.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trailer_id">Remolque (Opcional)</Label>
                                    <select
                                        id="trailer_id"
                                        name="trailer_id"
                                        defaultValue={editingAssignment.trailer_id || ''}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Ninguno</option>
                                        {trailers.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="driver_id">Conductor</Label>
                                    <select
                                        id="driver_id"
                                        name="driver_id"
                                        defaultValue={editingAssignment.driver_id}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Selecciona...</option>
                                        {drivers.map(d => (
                                            <option key={d.id} value={d.id}>{d.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="departure_datetime">Fecha de Salida</Label>
                                    <Input
                                        id="departure_datetime"
                                        name="departure_datetime"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(editingAssignment.departure_datetime)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="arrival_datetime">Fecha de Llegada</Label>
                                    <Input
                                        id="arrival_datetime"
                                        name="arrival_datetime"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(editingAssignment.arrival_datetime)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="folio">Folio</Label>
                                    <Input
                                        id="folio"
                                        name="folio"
                                        defaultValue={editingAssignment.folio || ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={editingAssignment.status}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="scheduled">Programado (Scheduled)</option>
                                        <option value="in_route">En Ruta (In Route)</option>
                                        <option value="completed">Completado (Completed)</option>
                                        <option value="cancelled">Cancelado (Cancelled)</option>
                                    </select>
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
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

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deletingId} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro que deseas eliminar esta asignación? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
