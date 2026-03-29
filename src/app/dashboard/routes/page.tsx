import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import RouteListAdmin from '@/components/dashboard/routes/route-list-admin'
import RouteAssignmentsAdmin from '@/components/dashboard/routes/route-assignments-admin'
import NewRouteDialog from '@/components/dashboard/routes/new-route-dialog'
import DownloadExcelButton from '@/components/dashboard/routes/download-excel-button'

export default async function RoutesPage() {
    const supabase = await createClient()

    // 1. Query "company_routes" table
    const { data: routes, error: routesError } = await supabase
        .from('company_routes')
        .select('*')
        .order('id', { ascending: true })

    if (routesError) console.error('Error fetching company routes:', routesError)

    // 2. Query "route_assignments" table
    const { data: assignments, error: assignmentsError } = await supabase
        .from('route_assignments')
        .select(`
            *,
            company_routes ( name ),
            trucks ( plate_number ),
            trailer ( id_number ),
            drivers ( first_name )
        `)
        .order('departure_datetime', { ascending: false })

    if (assignmentsError) console.error('Error fetching route assignments:', assignmentsError)

    // 3. Fetch Trucks for dropdown
    const { data: trucksData } = await supabase.from('trucks').select('id, plate_number')
    const trucksOptions = trucksData?.map(t => ({ id: t.id, label: t.plate_number })) || []

    // 4. Fetch Trailers for dropdown
    const { data: trailersData } = await supabase.from('trailer').select('id, id_number')
    const trailersOptions = trailersData?.map(t => ({ id: t.id, label: t.id_number })) || []

    // 5. Fetch Drivers for dropdown
    const { data: driversData } = await supabase.from('drivers').select('id, first_name')
    const driversOptions = driversData?.map(d => ({ id: d.id, label: d.first_name })) || []

    // Route Options for dropdown
    const routeOptions = routes?.map(r => ({ id: r.id, label: r.name })) || []

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Rutas</h1>
                <NewRouteDialog />
            </div>

            <div className="flex flex-col gap-6">
                {/* 1st Card: Rutas Registradas */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader className="shrink-0">
                        <CardTitle>Registro de Rutas</CardTitle>
                        <CardDescription>Visualización y edición de rutas registradas para la compañía.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
                        {routesError ? (
                            <p className="text-destructive">Ocurrió un error cargando las rutas.</p>
                        ) : (
                            <RouteListAdmin routes={routes || []} />
                        )}
                    </CardContent>
                </Card>

                {/* 2nd Card: Asignaciones de Rutas */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between shrink-0">
                        <div className="space-y-1">
                            <CardTitle>Asignaciones de Rutas</CardTitle>
                            <CardDescription>Visualización, edición y eliminación de asignaciones de ruta.</CardDescription>
                        </div>
                        <DownloadExcelButton assignments={(assignments as any) || []} />
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
                        {assignmentsError ? (
                            <p className="text-destructive">Ocurrió un error cargando las asignaciones.</p>
                        ) : (
                            <RouteAssignmentsAdmin
                                assignments={(assignments as any) || []}
                                routes={routeOptions}
                                trucks={trucksOptions}
                                trailers={trailersOptions}
                                drivers={driversOptions}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
