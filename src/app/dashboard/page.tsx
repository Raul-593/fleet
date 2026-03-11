import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { Truck, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react'
import RouteAssignmentForm from '@/components/dashboard/route-assignment-form'

// Utilidad para contar estados
const countByStatus = (items: { status: string | null }[] | null, statusVal: string) => {
    if (!items) return 0
    return items.filter(
        (i) => i.status?.toLowerCase() === statusVal.toLowerCase()
    ).length
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Trucks
    const { data: trucks } = await supabase
        .from('trucks')
        .select('id, plate_number, status')

    // 2. Fetch Trailers
    const { data: trailers } = await supabase
        .from('trailer')
        .select('id, id_number, status')

    // 3. Fetch Active Routes
    const { data: routes } = await supabase
        .from('company_routes')
        .select('id, name, origin, destination, distance_km')
        .eq('active', true)

    // Filter units that are actually available for new assignments
    const availableTrucks = trucks?.filter((t) => t.status === 'available') || []
    const availableTrailers = trailers?.filter((t) => t.status === 'available') || []
    const activeRoutes = routes || []

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Métricas principales del sistema de gestión de flota.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

                {/* --- TRUCKS CARD --- */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold">Estado de Camiones</CardTitle>
                            <CardDescription>Resumen de unidades tractoras</CardDescription>
                        </div>
                        <Truck className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">
                            {trucks ? trucks.length : 0} <span className="text-sm font-normal text-muted-foreground">Total</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mb-1" />
                                <span className="font-semibold text-green-700 dark:text-green-300">
                                    {countByStatus(trucks as { status: string | null }[], 'available')}
                                </span>
                                <span className="text-xs text-green-600/80 dark:text-green-400/80">Disponibles</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                    {countByStatus(trucks as { status: string | null }[], 'in_route')}
                                </span>
                                <span className="text-xs text-blue-600/80 dark:text-blue-400/80">En Ruta</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mb-1" />
                                <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                                    {countByStatus(trucks as { status: string | null }[], 'maintenance')}
                                </span>
                                <span className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Taller</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- TRAILERS CARD --- */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold">Estado de Remolques</CardTitle>
                            <CardDescription>Resumen de capacidad de carga</CardDescription>
                        </div>
                        <Truck className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">
                            {trailers ? trailers.length : 0} <span className="text-sm font-normal text-muted-foreground">Total</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mb-1" />
                                <span className="font-semibold text-green-700 dark:text-green-300">
                                    {countByStatus(trailers as { status: string | null }[], 'available')}
                                </span>
                                <span className="text-xs text-green-600/80 dark:text-green-400/80">Disponibles</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                    {countByStatus(trailers as { status: string | null }[], 'in_route')}
                                </span>
                                <span className="text-xs text-blue-600/80 dark:text-blue-400/80">En Uso</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mb-1" />
                                <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                                    {countByStatus(trailers as { status: string | null }[], 'maintenance')}
                                </span>
                                <span className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Taller</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* --- ASSIGNMENT FORM --- */}
            <RouteAssignmentForm
                routes={activeRoutes}
                trucks={availableTrucks}
                trailers={availableTrailers}
            />

        </div>
    )
}
