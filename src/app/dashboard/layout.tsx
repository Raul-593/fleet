import Link from 'next/link'
import { ReactNode } from 'react'
import { Car, Map, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 text-foreground">
            <div className="flex flex-1">
                <aside className="hidden border-r bg-background w-64 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                                <Car className="h-6 w-6" />
                                <span className="">Fleet Master</span>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/vehicles"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <Car className="h-4 w-4" />
                                    Vehículos
                                </Link>
                                <Link
                                    href="/dashboard/routes"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <Map className="h-4 w-4" />
                                    Rutas
                                </Link>
                            </nav>
                        </div>
                        <div className="mt-auto p-4 flex flex-col items-center">
                            <span className="text-xs text-muted-foreground mb-4 w-full truncate">{user.email}</span>
                            <form action="/auth/signout" method="post" className='w-full'>
                                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-muted-foreground/10 hover:text-primary">
                                    <LogOut className="h-4 w-4" />
                                    Cerrar sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
