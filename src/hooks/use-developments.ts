import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Development } from '@/types/development'

const supabase = createClient()

export function useDevelopments(filters?: {
    search?: string
    status?: string
    type?: string
    developer?: string
}) {
    const { data, error, mutate } = useSWR(['developments', filters], async () => {
        let query = supabase
            .from('developments')
            .select('*, developer:developers(*)', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }

        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status_commercial', filters.status)
        }

        if (filters?.type && filters.type !== 'all') {
            query = query.eq('type', filters.type)
        }

        if (filters?.developer) {
            query = query.eq('developer_id', filters.developer)
        }

        const { data, error, count } = await query
        if (error) throw error
        return { data: data as Development[], count }
    })

    return {
        developments: data?.data || [],
        total: data?.count || 0,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

export function useDevelopment(id: string) {
    const { data, error, mutate } = useSWR(['developments', id], async () => {
        const { data, error } = await supabase
            .from('developments')
            .select('*, developer:developers(*)')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Development
    })

    return {
        development: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

export async function createDevelopment(data: any) {
    const { data: newDev, error } = await supabase
        .from('developments')
        .insert(data)
        .select()
        .single()
    if (error) throw error
    return newDev
}

export async function updateDevelopment(id: string, data: any) {
    const { data: updatedDev, error } = await supabase
        .from('developments')
        .update(data)
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return updatedDev
}

export async function deleteDevelopment(id: string) {
    const { error } = await supabase
        .from('developments')
        .delete()
        .eq('id', id)
    if (error) throw error
}
