'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Car, Map, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function MobileNav({ email }: { email: string | undefined }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <div className="md:hidden flex items-center justify-between border-b bg-background p-4 sticky top-0 z-40">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Car className="h-6 w-6" />
                    <span>Fleet Master</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden transition-all"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar mobile */}
            <div 
                className={`fixed inset-y-0 left-0 z-50 w-[80vw] sm:w-80 bg-background border-r shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                        <Car className="h-6 w-6" />
                        <span>Fleet Master</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium gap-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${pathname === '/dashboard' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-muted/50'}`}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/vehicles"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${pathname?.startsWith('/dashboard/vehicles') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-muted/50'}`}
                        >
                            <Car className="h-5 w-5" />
                            Vehículos
                        </Link>
                        <Link
                            href="/dashboard/routes"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${pathname?.startsWith('/dashboard/routes') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-muted/50'}`}
                        >
                            <Map className="h-5 w-5" />
                            Rutas
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t flex flex-col items-center">
                    <span className="text-sm font-medium text-muted-foreground mb-4 w-full truncate text-center">{email}</span>
                    <form action="/auth/signout" method="post" className='w-full'>
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10">
                            <LogOut className="h-5 w-5" />
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
