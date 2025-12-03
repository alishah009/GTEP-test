import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { env } from '@/config/env'

export const createServerSupabase = () =>
  createServerClient<Database>(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      async get(name: string) {
        const cookieStore = await cookies()
        return cookieStore.get(name)?.value
      }
    }
  })
