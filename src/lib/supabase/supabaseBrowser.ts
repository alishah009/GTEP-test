import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { env } from '@/config/env'

export enum PersistenceMode {
  Local = 'local',
  Session = 'session'
}

const PERSISTENCE_KEY = 'gtep:auth:persistence'

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null
let supabaseMode: PersistenceMode | null = null

/**
 * Gets the current authentication persistence mode.
 * Checks localStorage first (persistent), then sessionStorage (session-only), defaults to 'session'.
 */
export const getAuthPersistence = (): PersistenceMode => {
  if (typeof window === 'undefined') return PersistenceMode.Local
  const localValue = window.localStorage.getItem(PERSISTENCE_KEY) as PersistenceMode | null
  if (localValue === PersistenceMode.Local) return PersistenceMode.Local
  const sessionValue = window.sessionStorage.getItem(PERSISTENCE_KEY) as PersistenceMode | null
  if (sessionValue === PersistenceMode.Session) return PersistenceMode.Session
  return PersistenceMode.Session
}

/**
 * Clears all Supabase authentication cookies from the browser.
 * Used to enforce session-only mode when "Remember me" is unchecked.
 */
export const clearSupabaseCookies = () => {
  if (typeof document === 'undefined') return
  
  const cookies = document.cookie.split(';')
  const cookieNames: string[] = []
  
  cookies.forEach((cookie) => {
    const [name] = cookie.trim().split('=')
    if (name && (name.startsWith('sb-') || name.includes('supabase'))) {
      cookieNames.push(name)
    }
  })
  
  // Clear each cookie with common paths
  cookieNames.forEach((name) => {
    const paths = ['/', '/en', '/es']
    paths.forEach((path) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
      document.cookie = `${name}=; Max-Age=0; path=${path};`
    })
  })
}

/**
 * Sets the authentication persistence mode (local or session).
 * Configures storage flags and clears auth tokens from the opposite storage.
 * Forces client recreation when mode changes.
 */
export const setAuthPersistence = (mode: PersistenceMode) => {
  if (typeof window === 'undefined') return

  const clearSupabaseKeys = (storage: Storage) => {
    const keysToRemove: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key))
  }

  if (mode === PersistenceMode.Session) {
    window.sessionStorage.setItem(PERSISTENCE_KEY, PersistenceMode.Session)
    window.localStorage.removeItem(PERSISTENCE_KEY)
    clearSupabaseKeys(window.localStorage)
  } else {
    // Persistent: store flag in localStorage, clear sessionStorage flag
    window.localStorage.setItem(PERSISTENCE_KEY, PersistenceMode.Local)
    window.sessionStorage.removeItem(PERSISTENCE_KEY)
    // Clear any existing auth tokens from sessionStorage
    clearSupabaseKeys(window.sessionStorage)
  }

  if (supabaseMode !== mode) {
    supabaseClient = null
    supabaseMode = mode
  }
}

/**
 * Creates a storage adapter that routes to localStorage or sessionStorage
 * based on the current persistence mode. Ensures data is only in one storage.
 */
const createDynamicStorage = () => {
  return {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null
      const mode = getAuthPersistence()
      const storage = mode === PersistenceMode.Session ? window.sessionStorage : window.localStorage
      return storage.getItem(key)
    },
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined') return
      const mode = getAuthPersistence()
      if (mode === PersistenceMode.Session) {
        window.sessionStorage.setItem(key, value)
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, value)
        window.sessionStorage.removeItem(key)
      }
    },
    removeItem: (key: string): void => {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(key)
      window.sessionStorage.removeItem(key)
    }
  }
}

/**
 * Creates a Supabase client instance with the specified persistence mode.
 * Only persists sessions when mode is 'local' (Remember me checked).
 */
const createClient = (mode: PersistenceMode) => {
  const options: SupabaseClientOptions<'public'> = {
    auth: {
      persistSession: mode === PersistenceMode.Local,
      autoRefreshToken: true,
      storage: createDynamicStorage()
    }
  }
  return createBrowserClient<Database>(env.supabase.url, env.supabase.anonKey, options)
}

/**
 * Gets or creates the Supabase client instance.
 * Recreates the client if persistence mode has changed.
 */
export const getSupabaseClient = () => {
  const mode = getAuthPersistence()
  if (!supabaseClient || supabaseMode !== mode) {
    supabaseClient = createClient(mode)
    supabaseMode = mode
  }
  return supabaseClient
}

// Clear cookies on page load if sessionStorage flag is missing (tab was closed)
// This ensures session-only logins don't persist after tab close
if (typeof window !== 'undefined') {
  const hasLocalFlag = window.localStorage.getItem(PERSISTENCE_KEY) === PersistenceMode.Local
  const hasSessionFlag = window.sessionStorage.getItem(PERSISTENCE_KEY) === PersistenceMode.Session
  
  if (!hasLocalFlag && !hasSessionFlag) {
    const hasAuthCookies = document.cookie.split(';').some((cookie) => {
      const name = cookie.trim().split('=')[0]
      return name && (name.startsWith('sb-') || name.includes('supabase'))
    })
    
    if (hasAuthCookies) {
      clearSupabaseCookies()
    }
  }
}

export const supabase = getSupabaseClient()
