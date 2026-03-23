'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type RouteAssignment = {
    id: string
    departure_datetime: string
    arrival_datetime?: string
    status: string
    company_routes?: {
        name: string
    }
    trucks?: {
        plate_number: string
    }
}

export default function RouteCalendar({ assignments }: { assignments: RouteAssignment[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

    const next = () => {
        if (viewMode === 'week') {
            const nextDay = new Date(currentDate)
            nextDay.setDate(nextDay.getDate() + 7)
            setCurrentDate(nextDay)
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        }
    }

    const prev = () => {
        if (viewMode === 'week') {
            const prevDay = new Date(currentDate)
            prevDay.setDate(prevDay.getDate() - 7)
            setCurrentDate(prevDay)
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        }
    }

    let days: (Date | null)[] = []
    let displayStr = ""

    if (viewMode === 'week') {
        const currentDayOfWeek = currentDate.getDay() // 0 = Sunday
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek)

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            days.push(day)
        }

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        displayStr = startOfWeek.getMonth() === endOfWeek.getMonth()
            ? startOfWeek.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
            : `${startOfWeek.toLocaleString('es-ES', { month: 'short' })} - ${endOfWeek.toLocaleString('es-ES', { month: 'short', year: 'numeric' })}`
    } else {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null)
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
        }
        displayStr = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    }

    // Parse Date ignoring the DB's implicit UTC timezone (fixes the -5 hours shift)
    const parseDateLiteral = (dateStr: string) => {
        const literalStr = dateStr.substring(0, 19) // Gets "YYYY-MM-DDTHH:mm:ss"
        return new Date(literalStr)
    }

    // Helper to check if an assignment falls on a specific day
    const getAssignmentsForDay = (date: Date) => {
        if (!assignments) return []
        const currentTarget = new Date(date).setHours(0, 0, 0, 0)

        return assignments.filter(assignment => {
            const departureDate = parseDateLiteral(assignment.departure_datetime)
            const depStart = new Date(departureDate).setHours(0, 0, 0, 0)

            let arrStart = depStart
            if (assignment.arrival_datetime) {
                const arrivalDate = parseDateLiteral(assignment.arrival_datetime)
                arrStart = new Date(arrivalDate).setHours(0, 0, 0, 0)
            }

            return currentTarget >= depStart && currentTarget <= arrStart
        })
    }

    const formatTime = (dateString?: string) => {
        if (!dateString) return ''
        return parseDateLiteral(dateString).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <Card className="h-full flex flex-col border-2 border-foreground/10 rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/15">
                <CardTitle className="text-lg font-bold flex flex-col md:flex-row items-center md:items-end gap-2 tracking-tight">
                    <span className="uppercase text-primary/90 leading-none">Calendario</span>
                    <span className="text-xs font-normal text-muted-foreground pb-0.5 max-md:mt-1">asignación de rutas</span>
                </CardTitle>
                <div className="flex flex-col md:flex-row items-center gap-3 mt-3 md:mt-0">
                    <div className="flex bg-muted/80 p-1 rounded-lg border shadow-inner">
                        <Button
                            variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 text-xs ${viewMode === 'week' ? 'shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setViewMode('week')}>
                            Semana
                        </Button>
                        <Button
                            variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 text-xs ${viewMode === 'month' ? 'shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setViewMode('month')}>
                            Mes
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 bg-background border rounded-lg p-0.5 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8 rounded-sm hover:bg-muted">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="font-semibold w-32 md:w-36 text-center text-[10px] md:text-xs uppercase tracking-wider leading-tight">
                            {displayStr}
                        </div>
                        <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-sm hover:bg-muted">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-0 isolated">
                <div className="grid grid-cols-7 gap-px bg-border/50 flex-none z-10 shadow-sm relative">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                        <div key={day} className="text-center text-xs font-bold p-2 bg-muted/40 text-muted-foreground uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className={`grid grid-cols-7 gap-px flex-1 bg-border/40 min-h-0 relative z-0 custom-scrollbar overflow-y-auto ${viewMode === 'week' ? 'grid-rows-1' : 'auto-rows-[minmax(120px,1fr)]'}`}>

                    {days.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="min-h-0 h-full bg-background/50" />

                        const dayAssignments = getAssignmentsForDay(date)
                        const isToday = new Date().toDateString() === date.toDateString()

                        return (
                            <div key={date.toISOString()} className={`min-h-0 h-full p-2 flex flex-col bg-background transition-colors hover:bg-muted/10 overflow-hidden group
                                ${isToday ? 'ring-2 ring-inset ring-primary' : ''}`}>

                                <div className={`text-sm font-medium w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full mb-1
                                    ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                    {date.getDate()}
                                </div>

                                <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 scrollbar-hide pr-1">
                                    {dayAssignments.map(a => (
                                        <div key={a.id}
                                            className="text-[11px] leading-tight p-2 md:p-2.5 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col w-full"
                                            title={`Ruta: ${a.company_routes?.name || 'N/A'}\nVehículo: ${a.trucks?.plate_number || 'N/A'}`}>

                                            <div className="flex flex-col gap-0.5 truncate w-full mb-1">
                                                <span className="font-bold text-primary/90 uppercase truncate">{a.company_routes?.name || 'Ruta'}</span>
                                                <span className="text-muted-foreground uppercase truncate">{a.trucks?.plate_number || 'Vehículo'}</span>
                                            </div>

                                            <div className="border-t border-border/60 pt-1.5 mt-0.5 w-full flex text-[10px] text-muted-foreground font-medium truncate">
                                                <span className="truncate">{formatTime(a.departure_datetime)} - {formatTime(a.arrival_datetime)}</span>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
