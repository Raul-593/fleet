'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTruck(id: string, formData: FormData) {
    const supabase = await createClient()

    const plate_number = formData.get('plate_number') as string
    const status = formData.get('status') as string

    if (!plate_number || !status) {
        return { error: 'Por favor, completa los campos requeridos.' }
    }

    const { error } = await supabase
        .from('trucks')
        .update({ plate_number, status })
        .eq('id', id)

    if (error) {
        console.error('Error updating truck:', error)
        return { error: 'Ocurrió un error al actualizar el camión.' }
    }

    revalidatePath('/dashboard/vehicles')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateTrailer(id: string, formData: FormData) {
    const supabase = await createClient()

    const id_number = formData.get('id_number') as string
    const status = formData.get('status') as string

    if (!id_number || !status) {
        return { error: 'Por favor, completa los campos requeridos.' }
    }

    const { error } = await supabase
        .from('trailer')
        .update({ id_number, status })
        .eq('id', id)

    if (error) {
        console.error('Error updating trailer:', error)
        return { error: 'Ocurrió un error al actualizar el remolque.' }
    }

    revalidatePath('/dashboard/vehicles')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateDriver(id: string, formData: FormData) {
    const supabase = await createClient()

    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const status = formData.get('status') as string

    if (!first_name || !status) {
        return { error: 'Por favor, completa los campos requeridos.' }
    }

    const { error } = await supabase
        .from('drivers')
        .update({ first_name, last_name, status })
        .eq('id', id)

    if (error) {
        console.error('Error updating driver:', error)
        return { error: 'Ocurrió un error al actualizar el conductor.' }
    }

    revalidatePath('/dashboard/vehicles')
    revalidatePath('/dashboard')
    return { success: true }
}
