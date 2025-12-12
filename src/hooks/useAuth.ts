import { getSupabaseClient } from '@/lib/supabase/supabaseBrowser'
import { useQuery } from '@tanstack/react-query'

// Get current session
export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const {
        data: { session }
      } = await supabase.auth.getSession()
      return session
    }
  })
}

// Get current user
export function useAuth() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const {
        data: { user }
      } = await supabase.auth.getUser()
      return user
    }
  })
}
