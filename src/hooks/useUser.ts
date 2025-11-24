import { supabase } from '@/lib/supabase/supabaseBrowser'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'

export const useUser = (id?: string | null) => {
  return useQuery({
    queryKey: ['User', id ?? 'unknown'],
    enabled: Boolean(id),
    queryFn: async (): Promise<User> => {
      console.log('id', id)
      if (!id) {
        throw new Error('User id is required')
      }
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
      if (error) throw error
      return data as User
    }
  })
}
