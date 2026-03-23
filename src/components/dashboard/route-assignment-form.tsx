'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createRouteAssignment } from '@/app/dashboard/actions'
import { Navigation, Copy } from 'lucide-react'

type Route = { id: string; name: string; origin: string; destination: string; distance_km: number }
type Truck = { id: string; plate_number: string }
type Trailer = { id: string; id_number: string }
type Driver = { id: string; name: string }

export default function RouteAssignmentForm({
    routes,
    trucks,
    trailers,
    drivers
}: {
    routes: Route[],
    trucks: Truck[],
    trailers: Trailer[],
    drivers: Driver[]
}) {
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [departureDatetime, setDepartureDatetime] = useState('')
    const [arrivalDatetime, setArrivalDatetime] = useState('')

    // States for custom message & inputs
    const [selectedRouteId, setSelectedRouteId] = useState('')
    const [selectedTruck, setSelectedTruck] = useState('')
    const [selectedTrailer, setSelectedTrailer] = useState('')
    const [selectedDriver, setSelectedDriver] = useState('')
    const [folio, setFolio] = useState('')
    const [desdeNote, setDesde] = useState('')

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
            
        }

        setIsSubmitting(false)
    }

    // Helper building the custom message
    const selectedRouteObj = routes.find(r => r.id === selectedRouteId)

    const formattedDate = departureDatetime ? new Date(departureDatetime).toLocaleDateString('es-ES') : ''
    const formattedTime = departureDatetime ? new Date(departureDatetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''
    const formattedTimeArrival = arrivalDatetime ? new Date(arrivalDatetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''
    
    const customMessage = `
    FECHA: ${formattedDate}
    DESDE: ${desdeNote}
    DESTINO: ${selectedRouteObj?.destination || ''}
    FOLIO: ${folio}
    HORA: ${formattedTime}
    UNIDAD: ${selectedTruck}
    ARRASTRE: ${selectedTrailer}
    CONDUCTOR: ${selectedDriver}
    `

    const handleCopy = () => {
        navigator.clipboard.writeText(customMessage)
            .then(() => {
                setStatus({ type: 'success', message: '¡Mensaje copiado al portapapeles!' })
                
                // Clean specific form elements if desired
                setDepartureDatetime('')
                setArrivalDatetime('')
                setSelectedRouteId('')
                setSelectedTruck('')
                setSelectedTrailer('')
                setSelectedDriver('')
                setFolio('')
                setDesde('')            
                
            })
    }

    return (
        <Card className="mt-6 border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Navigation className="h-5 w-5" />
                        Nueva Asignación de Ruta
                    </CardTitle>
                    <CardDescription>Asigna vehículos y conductores disponibles a rutas programadas.</CardDescription>
                </div>
            </CardHeader>

            <div className="mt-2">
                <form action={clientAction} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        
                        {/* CARD 1: Asignación de Ruta */}
                        <Card className="h-full border-2 rounded-xl">
                            <CardHeader className="bg-muted/50 pb-4 border-b">
                                <CardTitle className="text-sm font-bold tracking-tight uppercase">Asignacion de Ruta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_route_id">Ruta de Empresa</Label>
                                    <select
                                        id="company_route_id"
                                        name="company_route_id"
                                        required
                                        value={selectedRouteId}
                                        onChange={(e) => setSelectedRouteId(e.target.value)}
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
                                <div className="space-y-2">
                                    <Label htmlFor="departure_datetime">Fecha de Salida</Label>
                                    <Input
                                        id="departure_datetime"
                                        name="departure_datetime"
                                        type="datetime-local"
                                        required
                                        value={departureDatetime}
                                        onChange={handleDepartureChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="arrival_datetime">Fecha de Llegada</Label>
                                    <Input
                                        id="arrival_datetime"
                                        name="arrival_datetime"
                                        type="datetime-local"
                                        required
                                        value={arrivalDatetime}
                                        onChange={(e) => setArrivalDatetime(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARD 2: Asignación de Conductor y Unidad */}
                        <Card className="h-full border-2 rounded-xl">
                            <CardHeader className="bg-muted/50 pb-4 border-b">
                                <CardTitle className="text-sm font-bold tracking-tight uppercase">Asignacion de Conductor y Unidad</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="driver_input">Conductor</Label>
                                    <Input
                                        id="driver_input"
                                        name="driver_input"
                                        list="drivers-list"
                                        required
                                        value={selectedDriver}
                                        onChange={(e) => setSelectedDriver(e.target.value)}
                                        placeholder="Escribe o selecciona conductor..."
                                    />
                                    <datalist id="drivers-list">
                                        {drivers.map(d => (
                                            <option key={d.id} value={d.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="truck_input">Camion</Label>
                                    <Input
                                        id="truck_input"
                                        name="truck_input"
                                        list="trucks-list"
                                        required
                                        value={selectedTruck}
                                        onChange={(e) => setSelectedTruck(e.target.value)}
                                        placeholder="Escribe o selecciona camión..."
                                    />
                                    <datalist id="trucks-list">
                                        {trucks.map(t => (
                                            <option key={t.id} value={t.plate_number} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trailer_input">Remolque</Label>
                                    <Input
                                        id="trailer_input"
                                        name="trailer_input"
                                        list="trailers-list"
                                        value={selectedTrailer}
                                        onChange={(e) => setSelectedTrailer(e.target.value)}
                                        placeholder="Escribe o selecciona remolque..."
                                    />
                                    <datalist id="trailers-list">
                                        {trailers.map(t => (
                                            <option key={t.id} value={t.id_number} />
                                        ))}
                                    </datalist>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARD 3: Mensaje Personalizado */}
                        <Card className="h-full border-2 rounded-xl">
                            <CardHeader className="bg-muted/50 pb-4 border-b flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-bold tracking-tight uppercase">Mensaje Personalizado</CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleCopy} 
                                    type="button"
                                    className="h-8 w-8 -my-2"
                                    title="Copiar mensaje"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="desde">Desde</Label>
                                    <Input
                                        id="desde"
                                        name="desde"
                                        value={desdeNote}
                                        onChange={(e) => setDesde(e.target.value)}
                                        placeholder="Desde"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="folio">Folio</Label>
                                    <Input
                                        id="folio"
                                        name="folio"
                                        value={folio}
                                        onChange={(e) => setFolio(e.target.value)}
                                        placeholder="Folio"
                                    />
                                </div>
                                <pre className="text-sm font-mono whitespace-pre-wrap bg-secondary/30 p-4 rounded-md border border-border/50 text-muted-foreground min-h-[180px]">
                                    {customMessage}
                                </pre>
                            </CardContent>
                        </Card>

                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-md text-sm font-medium ${status.type === 'error' ? 'bg-destructive/15 text-destructive border-destructive/30 border' : 'bg-green-500/15 text-green-600 border-green-500/30 border'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 bg-background z-10 p-4 rounded-xl shadow-sm border mt-4">
                        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
                            {isSubmitting ? 'Procesando Asignación...' : 'Confirmar Asignación'}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    )
}
