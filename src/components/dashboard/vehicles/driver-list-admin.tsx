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
import { updateDriver } from '@/app/dashboard/vehicles/actions'

type Driver = {
    id: string
    first_name: string
    last_name: string | null
    status: string
}

export default function DriverListAdmin({ drivers }: { drivers: Driver[] }) {
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = (driver: Driver) => setEditingDriver(driver)
    const handleClose = () => setEditingDriver(null)

    async function clientAction(formData: FormData) {
        if (!editingDriver) return
        setIsSubmitting(true)
        const res = await updateDriver(editingDriver.id, formData)
        setIsSubmitting(false)
        if (res?.success) handleClose()
        else alert(res?.error || 'Error al actualizar el conductor')
    }

    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-y-auto w-full">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 w-full">
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell className="font-medium">{driver.first_name}</TableCell>
                                    <TableCell>{driver.last_name || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            driver.status === 'available' ? 'bg-green-100 text-green-800' :
                                            driver.status === 'in_route' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {driver.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(driver)}>
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No hay conductores registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingDriver} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Conductor</DialogTitle>
                        <DialogDescription>Modifica la información del conductor.</DialogDescription>
                    </DialogHeader>
                    {editingDriver && (
                        <form action={clientAction} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Nombre</Label>
                                <Input id="first_name" name="first_name" defaultValue={editingDriver.first_name} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input id="last_name" name="last_name" defaultValue={editingDriver.last_name || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={editingDriver.status}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="available">Disponible (Available)</option>
                                    <option value="in_route">En Ruta (In Route)</option>
                                    <option value="inactive">Inactivo (Inactive)</option>
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
