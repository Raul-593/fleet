import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import TruckListAdmin from '@/components/dashboard/vehicles/truck-list-admin'
import TrailerListAdmin from '@/components/dashboard/vehicles/trailer-list-admin'
import DriverListAdmin from '@/components/dashboard/vehicles/driver-list-admin'

export default async function VehiclesPage() {
    const supabase = await createClient()

    // 1. Query "trucks" table
    const { data: trucks, error: errorTrucks } = await supabase
        .from('trucks')
        .select('*')
        .order('plate_number', { ascending: true })

    if (errorTrucks) console.error('Error fetching trucks:', errorTrucks)

    // 2. Query "trailer" table
    const { data: trailers, error: errorTrailers } = await supabase
        .from('trailer')
        .select('*')
        .order('id_number', { ascending: true })

    if (errorTrailers) console.error('Error fetching trailers:', errorTrailers)

    // 3. Query "drivers" table
    const { data: drivers, error: errorDrivers } = await supabase
        .from('drivers')
        .select('*')
        .order('first_name', { ascending: true })

    if (errorDrivers) console.error('Error fetching drivers:', errorDrivers)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Vehículos y Personal</h1>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* Driver Card */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader className="shrink-0">
                        <CardTitle>Conductores</CardTitle>
                        <CardDescription>
                            Gestión del personal operativo y su disponibilidad.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
                        {errorDrivers ? (
                            <p className="text-destructive">Ocurrió un error cargando los conductores.</p>
                        ) : (
                            <DriverListAdmin drivers={(drivers as any) || []} />
                        )}
                    </CardContent>
                </Card>

                {/* Truck Card */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader className="shrink-0">
                        <CardTitle>Flota de Camiones</CardTitle>
                        <CardDescription>
                            Gestiona los vehículos tractores y su estado actual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
                        {errorTrucks ? (
                            <p className="text-destructive">Ocurrió un error cargando los camiones.</p>
                        ) : (
                            <TruckListAdmin trucks={trucks || []} />
                        )}
                    </CardContent>
                </Card>

                {/* Trailer Card */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader className="shrink-0">
                        <CardTitle>Remolques</CardTitle>
                        <CardDescription>
                            Registro de remolques y capacidad de carga.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
                        {errorTrailers ? (
                            <p className="text-destructive">Ocurrió un error cargando los remolques.</p>
                        ) : (
                            <TrailerListAdmin trailers={trailers || []} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
