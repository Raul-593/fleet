import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function VehiclesPage() {
    const supabase = await createClient()

    // Query "trucks" table
    const { data: trucks, error: errorTrucks } = await supabase
        .from('trucks')
        .select('*')
        .order('id', { ascending: true })

    if (errorTrucks) {
        console.error('Error fetching trucks:', errorTrucks)
    }

    // Query "trailer" table
    const { data: trailers, error: errorTrailers } = await supabase
        .from('trailer')
        .select('*')
        .order('id', { ascending: true })

    if (errorTrailers) {
        console.error('Error fetching trailers:', errorTrailers)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Vehículos y Remolques</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Añadir Remolque</Button>
                    <Button>Añadir Vehículo</Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Truck Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Flota de Camiones</CardTitle>
                        <CardDescription>
                            Gestiona los vehículos tractores y su estado actual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorTrucks ? (
                            <p className="text-destructive">Ocurrió un error cargando los camiones.</p>
                        ) : (
                            <Table>
                                <TableCaption>Lista de camiones registrados.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Matrícula</TableHead>
                                        <TableHead>Año</TableHead>
                                        <TableHead className="text-right">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trucks && trucks.length > 0 ? (
                                        trucks.map((truck) => (
                                            <TableRow key={truck.id}>
                                                <TableCell className="font-medium">{truck.plate_number}</TableCell>
                                                <TableCell>{truck.year}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${truck.status === 'active' || truck.status === 'activo'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : truck.status === 'maintenance' || truck.status === 'mantenimiento'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                        }`}>
                                                        {truck.status || 'Desconocido'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                No hay camiones registrados en la base de datos.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Trailer Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Remolques</CardTitle>
                        <CardDescription>
                            Registro de remolques y capacidad de carga.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorTrailers ? (
                            <p className="text-destructive">Ocurrió un error cargando los remolques.</p>
                        ) : (
                            <Table>
                                <TableCaption>Lista de remolques en el sistema.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número de ID</TableHead>
                                        <TableHead>Capacidad (Tonela..)</TableHead>
                                        <TableHead className="text-right">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trailers && trailers.length > 0 ? (
                                        trailers.map((trailer) => (
                                            <TableRow key={trailer.id}>
                                                <TableCell className="font-medium">{trailer.id_number}</TableCell>
                                                <TableCell>{trailer.capacity_tons}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${trailer.status === 'active' || trailer.status === 'activo'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                        : trailer.status === 'maintenance' || trailer.status === 'mantenimiento'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                        }`}>
                                                        {trailer.status || 'Desconocido'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                No hay remolques registrados en la base de datos.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
