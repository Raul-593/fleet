'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Clock, Truck, Container, Info, User, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateRouteAssignment } from '@/app/dashboard/actions'

export type RouteAssignment = {
    id: string
    departure_datetime: string
    arrival_datetime?: string
    carga_time?: string
    status: string
    folio?: string
    company_routes?: {
        name: string
    }
    trucks?: {
        plate_number: string
    }
    trailer?: {
        id_number: string
    }
    driver?: {
        first_name: string
        last_name: string
    }
}

export default function RouteCalendar({ assignments }: { assignments: RouteAssignment[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
    const [selectedAssignment, setSelectedAssignment] = useState<RouteAssignment | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailMode, setIsDetailMode] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'bg-card border-border text-card-foreground'
            case 'loading':
                return 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200'
            case 'in_route':
            case 'in_progress':
                return 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200'
            case 'completed':
                return 'bg-green-100 border-green-300 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200'
            default:
                return 'bg-card border-border text-card-foreground'
        }
    }

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
            // Priority: carga_time, then departure_datetime
            const startDateStr = assignment.carga_time || assignment.departure_datetime
            const startDate = parseDateLiteral(startDateStr)
            const depStart = new Date(startDate).setHours(0, 0, 0, 0)

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

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return ''
        return parseDateLiteral(dateString).toLocaleString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }


    const handleAssignmentClick = (a: RouteAssignment) => {
        setSelectedAssignment(a)
        setIsDetailMode(true) // Always open in Detail Mode
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async (formData: FormData) => {
        setIsSubmitting(true)
        const result = await updateRouteAssignment(formData)
        setIsSubmitting(false)
        if (result.success) {
            setIsEditDialogOpen(false)
        } else {
            alert(result.error)
        }
    }

    return (
        <Card className="h-full flex flex-col border-2 border-foreground/10 rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/15 pb-2">
                <div className="flex flex-col w-full md:w-auto items-center md:items-start">
                    <CardTitle className="text-lg font-bold flex flex-col md:flex-row items-center md:items-end gap-2 tracking-tight">
                        <span className="uppercase text-primary/90 leading-none">Calendario</span>
                        <span className="text-xs font-normal text-muted-foreground pb-0.5 max-md:mt-1 flex items-center gap-1" title="Toque una tarjeta para editar e inspeccionar">asignación de rutas <Info className="h-3 w-3 mt-0.5 md:hidden" /></span>
                    </CardTitle>
                    {/* Color Legend */}
                    <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase text-muted-foreground/80 justify-center flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm"></div>
                            Carga
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-blue-500 shadow-sm"></div>
                            En Ruta
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500 shadow-sm"></div>
                            Completado
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    <div className="flex bg-muted/80 p-1 rounded-lg border shadow-inner w-full md:w-auto justify-center">
                        <Button
                            variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 text-xs w-20 md:w-auto flex-1 md:flex-none ${viewMode === 'week' ? 'shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setViewMode('week')}>
                            Semana
                        </Button>
                        <Button
                            variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 text-xs w-20 md:w-auto flex-1 md:flex-none ${viewMode === 'month' ? 'shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setViewMode('month')}>
                            Mes
                        </Button>
                    </div>

                    <div className="flex items-center justify-between md:justify-center w-full md:w-auto gap-1 bg-background border rounded-lg p-0.5 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8 rounded-sm hover:bg-muted">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="font-semibold w-full md:w-36 text-center text-[10px] md:text-xs uppercase tracking-wider leading-tight px-2">
                            {displayStr}
                        </div>
                        <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-sm hover:bg-muted">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-0 isolated overflow-x-auto custom-scrollbar relative">
                <div className="min-w-[800px] flex-1 flex flex-col min-h-0">
                    <div className="grid grid-cols-7 gap-px bg-border/50 flex-none z-10 shadow-sm sticky top-0">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                            <div key={day} className="text-center text-xs font-bold p-2 bg-muted/40 text-muted-foreground uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className={`grid grid-cols-7 gap-px flex-1 bg-border/40 min-h-0 relative z-0 overflow-y-auto ${viewMode === 'week' ? 'grid-rows-1 custom-scrollbar' : 'auto-rows-[minmax(120px,1fr)] custom-scrollbar'}`}>

                        {days.map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} className="min-h-0 h-full bg-background/50" />

                            const dayAssignments = getAssignmentsForDay(date)
                            const isToday = new Date().toDateString() === date.toDateString()

                            return (
                                <div key={date.toISOString()} className={`min-h-0 h-full p-2 flex flex-col bg-background transition-colors hover:bg-muted/5 group
                                    ${isToday ? 'ring-2 ring-inset ring-primary' : ''}`}>

                                    <div className={`text-sm font-medium w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full mb-1
                                        ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                        {date.getDate()}
                                    </div>

                                    <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 scrollbar-hide pr-1">
                                        {dayAssignments.map(a => (
                                            <div key={a.id} className="relative z-0 hover:z-[10] group/assignment transition-transform duration-300 ease-in-out hover:scale-105">
                                                {/* Card */}
                                                <div
                                                    onClick={() => handleAssignmentClick(a)}
                                                    className={`cursor-pointer text-[11px] leading-tight p-2 md:p-2.5 rounded-lg border shadow-sm hover:shadow-md transition-all flex flex-col w-full ${getStatusStyles(a.status)}`}
                                                    title="Ver / Editar"
                                                >
                                                    <div className="flex flex-col gap-0.5 truncate w-full mb-1">
                                                        <div className="flex justify-between items-start w-full gap-1">
                                                            <span className="font-bold uppercase truncate">{a.company_routes?.name || 'Ruta'}</span>
                                                            {a.folio && (
                                                                <span 
                                                                    className={`text-[8px] md:text-[9px] px-1.5 py-0.5 font-bold rounded-sm whitespace-nowrap leading-none mt-0.5 border-bg-background/50 border-foreground/10`} 
                                                                    title={"Folio"}
                                                                >
                                                                    {a.folio}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="opacity-80 uppercase truncate">{a.trucks?.plate_number || 'Vehículo'}</span>
                                                    </div>

                                                    <div className="border-t border-foreground/10 pt-1.5 mt-0.5 w-full flex text-[10px] opacity-70 font-medium truncate text-blue-800 dark:text-blue-300">
                                                        <span className="truncate" title="Inicio Carga - Llegada Est.">
                                                            {formatTime(a.carga_time || a.departure_datetime)} - {formatTime(a.arrival_datetime)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>

            {/* View / Edit Modal */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0 border-2">
                    <DialogHeader className="p-4 bg-muted/20 border-b">
                        <DialogTitle className="flex justify-between items-center pr-4">
                            <span>{isDetailMode ? "Detalles de la Operación" : "Editar Asignación"}</span>
                        </DialogTitle>
                        <DialogDescription className="text-left mt-1.5 hidden md:block text-xs">
                            {isDetailMode ? "Información expandida de la ruta asignada." : "Modifica los detalles de la ruta asignada a continuación."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedAssignment && isDetailMode && (
                        <div className="flex flex-col animate-in fade-in-0 duration-300">
                            <div className="bg-primary/5 border-b p-4">
                                <div className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <h4 className="font-bold text-primary uppercase text-sm md:text-base leading-none">{selectedAssignment.company_routes?.name}</h4>
                                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1.5 tracking-wider">Detalles Completos</p>
                                    </div>
                                    {selectedAssignment.folio && (
                                        <div className="bg-primary text-primary-foreground text-[10px] md:text-xs font-black px-2.5 py-1.5 rounded shadow-sm">
                                            {selectedAssignment.folio}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-5">
                                {/* Vehículo e insumos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Truck className="h-3.5 w-3.5" /> Camión
                                        </span>
                                        <p className="text-sm border-b pb-1 font-bold uppercase truncate">{selectedAssignment.trucks?.plate_number || '---'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Container className="h-3.5 w-3.5" /> Remolque
                                        </span>
                                        {selectedAssignment.trailer?.id_number ? (
                                            <p className="text-sm border-b pb-1 font-bold uppercase truncate">{selectedAssignment.trailer.id_number}</p>
                                        ) : (
                                            <p className="text-sm border-b pb-1 font-medium text-muted-foreground">Ninguno</p>
                                        )}
                                    </div>
                                </div>

                                {/* Conductor */}
                                <div className="space-y-1.5 bg-muted/20 p-3 rounded-lg border shadow-inner">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5" /> Conductor
                                    </span>
                                    <p className="text-sm font-bold uppercase truncate tracking-wide">
                                        {selectedAssignment.driver ? `${selectedAssignment.driver.first_name} ${selectedAssignment.driver.last_name || ''}`.trim() : 'Sin Asignar'}
                                    </p>
                                </div>                                                    

                                {/* Status Bar */}
                                <div className={`p-3 rounded-lg border flex items-center gap-2.5 shadow-sm ${getStatusStyles(selectedAssignment.status)}`}>
                                    <Info className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-wider">Estado: {selectedAssignment.status}</span>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-2.5 pt-3 border-t border-dashed">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" /> Carga
                                        </span>
                                        <span className="font-bold tabular-nums">{formatDateTime(selectedAssignment.carga_time)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" /> Salida
                                        </span>
                                        <span className="font-bold tabular-nums text-blue-600 dark:text-blue-400">{formatDateTime(selectedAssignment.departure_datetime)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold pt-1.5">
                                        <span className="text-muted-foreground font-medium flex items-center gap-1.5 text-sm:">
                                            <Clock className="h-3.5 w-3.5 text-green-600" /> Llegada Est.
                                        </span>
                                        <span className="tabular-nums text-green-600 dark:text-green-400">{formatDateTime(selectedAssignment.arrival_datetime)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/40 border-t flex">
                                <Button className="w-full gap-2 font-bold transition-all shadow-md hover:shadow-lg" onClick={() => setIsDetailMode(false)}>
                                    <Edit className="h-4 w-4" /> Editar Información
                                </Button>
                            </div>
                        </div>
                    )}

                    {selectedAssignment && !isDetailMode && (
                        <form action={handleUpdate} className="space-y-4 py-4 px-4 bg-background animate-in slide-in-from-right-4 duration-300">
                            <input type="hidden" name="id" value={selectedAssignment.id} />
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-folio" className="text-right text-xs font-bold uppercase truncate">Folio</Label>
                                <Input id="edit-folio" name="folio" defaultValue={selectedAssignment.folio} className="col-span-3 h-9 text-sm font-medium" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right text-xs font-bold uppercase truncate">Estado</Label>
                                <select
                                    id="edit-status"
                                    name="status"
                                    defaultValue={selectedAssignment.status}
                                    className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="scheduled">Programado</option>
                                    <option value="loading">Carga</option>
                                    <option value="in_route">En Ruta</option>
                                    <option value="completed">Completado</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-conductor" className="text-right text-[10px] leading-tight font-bold uppercase">Conductor</Label>
                                <Input 
                                    id="edit-conductor" 
                                    name="driver_input" 
                                    type="text" 
                                    defaultValue={selectedAssignment.driver ? `${selectedAssignment.driver.first_name} ${selectedAssignment.driver.last_name || ''}`.trim() : ''} 
                                    className="col-span-3 h-9 text-sm" 
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-carga" className="text-right text-[10px] leading-tight font-bold uppercase">Hora Carga</Label>
                                <Input id="edit-carga" name="carga_time" type="datetime-local" defaultValue={selectedAssignment.carga_time?.substring(0, 16)} className="col-span-3 h-9 text-sm flex-1 w-full" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-departure" className="text-right text-[10px] leading-tight font-bold uppercase">Inicio Ruta</Label>
                                <Input id="edit-departure" name="departure_datetime" type="datetime-local" defaultValue={selectedAssignment.departure_datetime?.substring(0, 16)} className="col-span-3 h-9 text-sm w-full font-medium" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-arrival" className="text-right text-[10px] leading-tight font-bold uppercase">Llegada Est.</Label>
                                <Input id="edit-arrival" name="arrival_datetime" type="datetime-local" defaultValue={selectedAssignment.arrival_datetime?.substring(0, 16)} className="col-span-3 h-9 text-sm w-full font-bold text-green-700 dark:text-green-500" />
                            </div>
                            <DialogFooter className="pt-4 mt-2 border-t sm:justify-between flex-row gap-2">
                                <Button variant="outline" type="button" onClick={() => setIsDetailMode(true)} disabled={isSubmitting} className="w-1/2 sm:w-auto font-semibold">
                                    <ChevronLeft className="w-4 h-4 mr-1"/> Atrás
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="w-1/2 sm:w-auto font-bold">
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}
