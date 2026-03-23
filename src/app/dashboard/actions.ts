'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRouteAssignment(formData: FormData) {
    const supabase = await createClient()

    const company_route_id = formData.get('company_route_id') as string
    const truck_input = (formData.get('truck_input') as string)?.trim()
    const trailer_input = (formData.get('trailer_input') as string)?.trim()
    const driver_input = (formData.get('driver_input') as string)?.trim()
    const departure_datetime = formData.get('departure_datetime') as string
    const arrival_datetime = formData.get('arrival_datetime') as string

    // Basic validation
    if (!company_route_id || !truck_input || !driver_input || !departure_datetime || !arrival_datetime) {
        return { error: 'Por favor, completa todos los campos obligatorios.' }
    }

    let final_truck_id = ''
    let final_trailer_id: string | null = null
    let final_driver_id = ''

    // 1. Resolve or Create Truck
    const { data: existingTruck } = await supabase
        .from('trucks')
        .select('id')
        .eq('plate_number', truck_input)
        .single()

    if (existingTruck) {
        final_truck_id = existingTruck.id
    } else {
        const { data: newTruck, error: newTruckError } = await supabase
            .from('trucks')
            .insert({ plate_number: truck_input, status: 'in_route' })
            .select('id')
            .single()
            
        if (newTruckError) {
            console.error('Error creating truck:', newTruckError)
            return { error: 'No se pudo registrar el nuevo camión.' }
        }
        final_truck_id = newTruck.id
    }

    // 2. Resolve or Create Trailer
    if (trailer_input) {
        const { data: existingTrailer } = await supabase
            .from('trailer')
            .select('id')
            .eq('id_number', trailer_input)
            .single()

        if (existingTrailer) {
            final_trailer_id = existingTrailer.id
            
            // 5. Update Trailer Status (for existing ones)
            const { error: trailerError } = await supabase
                .from('trailer')
                .update({ status: 'in_route' })
                .eq('id', final_trailer_id)
            if (trailerError) console.error('Error updating trailer status:', trailerError)
        } else {
            const { data: newTrailer, error: newTrailerError } = await supabase
                .from('trailer')
                .insert({ id_number: trailer_input, status: 'in_route' })
                .select('id')
                .single()
                
            if (newTrailerError) {
                console.error('Error creating trailer:', newTrailerError)
                return { error: 'No se pudo registrar el nuevo remolque.' }
            }
            final_trailer_id = newTrailer.id
        }
    }

    // 2.5 Resolve or Create Driver
    if (driver_input) {
        const nameParts = driver_input.split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || null

        let query = supabase.from('drivers').select('id').eq('first_name', firstName)
        if (lastName) {
            query = query.eq('last_name', lastName)
        } else {
            query = query.is('last_name', null)
        }

        const { data: existingDriver } = await query.single()

        if (existingDriver) {
            final_driver_id = existingDriver.id
            
            // Update Driver Status
            const { error: driverError } = await supabase
                .from('drivers')
                .update({ status: 'in_route' })
                .eq('id', final_driver_id)
            if (driverError) console.error('Error updating driver status:', driverError)
        } else {
            const { data: newDriver, error: newDriverError } = await supabase
                .from('drivers')
                .insert({ first_name: firstName, last_name: lastName, status: 'in_route' })
                .select('id')
                .single()
                
            if (newDriverError) {
                console.error('Error creating driver:', newDriverError)
                return { error: 'No se pudo registrar el nuevo conductor.' }
            }
            final_driver_id = newDriver.id
        }
    }

    // 3. Insert into route_assignments
    const { error: insertError } = await supabase
        .from('route_assignments')
        .insert({
            company_route_id,
            truck_id: final_truck_id,
            trailer_id: final_trailer_id,
            driver_id: final_driver_id,
            departure_datetime,
            arrival_datetime,
            status: 'scheduled'
        })

    if (insertError) {
        console.error('Error inserting route assignment:', insertError)
        return { error: 'Ocurrió un error al crear la asignación.' }
    }

    // 4. Update Truck Status to in_route (for existing ones)
    if (existingTruck) {
        const { error: truckError } = await supabase
            .from('trucks')
            .update({ status: 'in_route' })
            .eq('id', final_truck_id)

        if (truckError) console.error('Error updating truck status:', truckError)
    }

    // Revalidate the dashboard page to reflect changes in metrics and available lists
    revalidatePath('/dashboard')

    return { success: true }
}
