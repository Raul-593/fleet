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

export default async function RoutesPage() {
    const supabase = await createClient()

    // Query "company_routes" table
    const { data: routes, error } = await supabase
        .from('company_routes')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching company routes:', error)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Rutas</h1>
                <Button>Programar Ruta</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registro de Rutas</CardTitle>
                    <CardDescription>Visualización de rutas registradas para la compañía.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <p className="text-destructive">Ocurrió un error cargando las rutas.</p>
                    ) : (
                        <Table>
                            <TableCaption>Lista de rutas disponibles.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Origen</TableHead>
                                    <TableHead>Destino</TableHead>
                                    <TableHead className="text-right">Distancia (km)</TableHead>
                                    <TableHead className="text-right">Duración (min)</TableHead>
                                    <TableHead className="text-right">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {routes && routes.length > 0 ? (
                                    routes.map((route) => (
                                        <TableRow key={route.id}>    
                                            <TableCell>{route.name}</TableCell>
                                            <TableCell>{route.origin}</TableCell>
                                            <TableCell>{route.destination}</TableCell>
                                            <TableCell className="text-right">{route.distance_km}</TableCell>
                                            <TableCell className="text-right">{route.standard_duration_minutes}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${route.active
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}>
                                                    {route.active ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No hay rutas registradas en la base de datos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
