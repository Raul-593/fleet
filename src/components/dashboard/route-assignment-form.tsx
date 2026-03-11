'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createRouteAssignment } from '@/app/dashboard/actions'
import { Navigation } from 'lucide-react'

type Route = { id: string; name: string; origin: string; destination: string; distance_km: number }
type Truck = { id: string; plate_number: string }
type Trailer = { id: string; id_number: string }

export default function RouteAssignmentForm({
    routes,
    trucks,
    trailers
}: {
    routes: Route[],
    trucks: Truck[],
    trailers: Trailer[]
}) {
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [departureDatetime, setDepartureDatetime] = useState('')
    const [arrivalDatetime, setArrivalDatetime] = useState('')

    const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDeparture = e.target.value
        setDepartureDatetime(newDeparture)

        if (newDeparture) {
            const departureDate = new Date(newDeparture)
            // Add 3 hours (3 * 60 * 60 * 1000 milliseconds)
            const arrivalDate = new Date(departureDate.getTime() + 3 * 60 * 60 * 1000)

            // Format to YYYY-MM-DDThh:mm for datetime-local
            const formatForInput = (date: Date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                return `${year}-${month}-${day}T${hours}:${minutes}`
            }

            setArrivalDatetime(formatForInput(arrivalDate))
        } else {
            setArrivalDatetime('')
        }
    }

    async function clientAction(formData: FormData) {
        setIsSubmitting(true)
        setStatus({ type: null, message: '' })

        const res = await createRouteAssignment(formData)

        if (res?.error) {
            setStatus({ type: 'error', message: res.error })
        } else if (res?.success) {
            setStatus({ type: 'success', message: '¡Asignación creada exitosamente!' })
            // Opcional: limpiar el formulario si se requiere reactivar esto.
        }

        setIsSubmitting(false)
    }

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">Nueva Asignación de Ruta</CardTitle>
                    <CardDescription>Asigna vehículos disponibles a rutas programadas.</CardDescription>
                </div>
                <Navigation className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="mt-4">
                <form action={clientAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Selector de Ruta */}
                        <div className="space-y-2">
                            <Label htmlFor="company_route_id">Ruta de Empresa</Label>
                            <select
                                id="company_route_id"
                                name="company_route_id"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Selecciona una ruta...</option>
                                {routes.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.distance_km} km)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selector de Camión */}
                        <div className="space-y-2">
                            <Label htmlFor="truck_id">Camión Asignado (Tractor)</Label>
                            <select
                                id="truck_id"
                                name="truck_id"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Selecciona camión disponible...</option>
                                {trucks.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.plate_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selector de Remolque */}
                        <div className="space-y-2">
                            <Label htmlFor="trailer_id">Remolque</Label>
                            <select
                                id="trailer_id"
                                name="trailer_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Sin remolque...</option>
                                {trailers.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.id_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha de Salida */}
                        <div className="space-y-2">
                            <Label htmlFor="departure_datetime">Fecha y Hora de Salida</Label>
                            <Input
                                id="departure_datetime"
                                name="departure_datetime"
                                type="datetime-local"
                                required
                                value={departureDatetime}
                                onChange={handleDepartureChange}
                            />
                        </div>

                        {/* Fecha Estimada de Llegada */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="arrival_datetime">Fecha y Hora de Llegada (Estimada)</Label>
                            <Input
                                id="arrival_datetime"
                                name="arrival_datetime"
                                type="datetime-local"
                                required
                                value={arrivalDatetime}
                                onChange={(e) => setArrivalDatetime(e.target.value)}
                            />
                        </div>

                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-md text-sm ${status.type === 'error' ? 'bg-red-50 text-red-800 border-red-200 border' : 'bg-green-50 text-green-800 border-green-200 border'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Asignando...' : 'Crear Asignación de Ruta'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
