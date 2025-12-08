import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase' // Optional: type definitions
import { env } from '@/config/env'

export const supabase = createBrowserClient<Database>(env.supabase.url, env.supabase.anonKey)
