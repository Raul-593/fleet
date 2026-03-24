'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRoute(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const origin = formData.get('origin') as string
    const destination = formData.get('destination') as string
    const active = formData.get('active') === 'true'

    if (!name || !origin || !destination) {
        return { error: 'Por favor, completa los campos requeridos.' }
    }

    const { error } = await supabase
        .from('company_routes')
        .update({ name, origin, destination, active })
        .eq('id', id)

    if (error) {
        console.error('Error updating company route:', error)
        return { error: 'Ocurrió un error al actualizar la ruta.' }
    }

    revalidatePath('/dashboard/routes')
    return { success: true }
}

export async function updateRouteAssignment(id: string, formData: FormData) {
    const supabase = await createClient()

    const company_route_id = formData.get('company_route_id') as string | null
    const truck_id = formData.get('truck_id') as string | null
    const trailer_id = formData.get('trailer_id') as string | null
    const driver_id = formData.get('driver_id') as string | null
    const departure_datetime = formData.get('departure_datetime') as string | null
    const arrival_datetime = formData.get('arrival_datetime') as string | null
    const folio = formData.get('folio') as string | null
    const status = formData.get('status') as string | null

    if (!company_route_id || !truck_id || !driver_id || !departure_datetime || !arrival_datetime) {
        return { error: 'Por favor, completa los campos obligatorios.' }
    }

    const { error } = await supabase
        .from('route_assignments')
        .update({
            company_route_id,
            truck_id,
            trailer_id: trailer_id || null, // Handle empty string as null
            driver_id,
            departure_datetime,
            arrival_datetime,
            folio: folio || null,
            status: status || 'scheduled'
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating route assignment:', error)
        return { error: 'Ocurrió un error al actualizar la asignación.' }
    }

    revalidatePath('/dashboard/routes')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteRouteAssignment(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('route_assignments')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting route assignment:', error)
        return { error: 'Ocurrió un error al eliminar la asignación.' }
    }

    revalidatePath('/dashboard/routes')
    revalidatePath('/dashboard')
    return { success: true }
}
