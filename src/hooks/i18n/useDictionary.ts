'use client'

import { useEffect, useState, useRef } from 'react'
import { useLocale } from './useLocale'
import { getDictionaryClient } from '@/lib/i18n/dictionaries.client'

type Dictionary = Awaited<ReturnType<typeof getDictionaryClient>>

export function useDictionary() {
  const locale = useLocale()
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [loading, setLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentLocaleRef = useRef(locale)

  useEffect(() => {
    // Track current locale
    currentLocaleRef.current = locale

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Load dictionary asynchronously
    const loadDictionary = async () => {
      // Set loading in async callback (not synchronously in effect)
      Promise.resolve().then(() => {
        if (!abortController.signal.aborted && currentLocaleRef.current === locale) {
          setLoading(true)
        }
      })

      try {
        const dictionary = await getDictionaryClient(locale)

        // Only update state if request wasn't aborted and locale hasn't changed
        if (!abortController.signal.aborted && currentLocaleRef.current === locale) {
          setDict(dictionary)
          setLoading(false)
        }
      } catch (error) {
        // Only update state if request wasn't aborted and it's not an abort error
        if (!abortController.signal.aborted && currentLocaleRef.current === locale) {
          if (error instanceof Error && error.name !== 'AbortError') {
            setLoading(false)
          }
        }
      }
    }

    loadDictionary()

    // Cleanup: abort request if locale changes or component unmounts
    return () => {
      abortController.abort()
    }
  }, [locale])

  return { dict, loading, locale }
}
