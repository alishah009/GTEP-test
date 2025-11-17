import { supabase } from '@/lib/supabase/supabaseBrowser'
import { useQuery } from '@tanstack/react-query'

// Get current session
export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      return session
    }
  })
}

// Get current user
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      return user
    }
  })
}
