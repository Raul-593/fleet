'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRouteAssignment(formData: FormData) {
    const supabase = await createClient()

    const company_route_id = formData.get('company_route_id') as string
    const truck_id = formData.get('truck_id') as string
    const trailer_id = formData.get('trailer_id') as string // Can be empty
    const departure_datetime = formData.get('departure_datetime') as string
    const arrival_datetime = formData.get('arrival_datetime') as string

    // Basic validation
    if (!company_route_id || !truck_id || !departure_datetime || !arrival_datetime) {
        return { error: 'Por favor, completa todos los campos obligatorios.' }
    }

    // 1. Insert into route_assignments
    const { error: insertError } = await supabase
        .from('route_assignments')
        .insert({
            company_route_id,
            truck_id,
            trailer_id: trailer_id || null, // null if empty string
            departure_datetime,
            arrival_datetime,
            status: 'scheduled'
        })

    if (insertError) {
        console.error('Error inserting route assignment:', insertError)
        return { error: 'Ocurrió un error al crear la asignación.' }
    }

    // 2. Update Truck Status to in_route
    const { error: truckError } = await supabase
        .from('trucks')
        .update({ status: 'in_route' })
        .eq('id', truck_id)

    if (truckError) {
        console.error('Error updating truck status:', truckError)
    }

    // 3. Update Trailer Status if assigned
    if (trailer_id) {
        const { error: trailerError } = await supabase
            .from('trailer')
            .update({ status: 'in_route' })
            .eq('id', trailer_id)

        if (trailerError) {
            console.error('Error updating trailer status:', trailerError)
        }
    }

    // Revalidate the dashboard page to reflect changes in metrics and available lists
    revalidatePath('/dashboard')

    return { success: true }
}
