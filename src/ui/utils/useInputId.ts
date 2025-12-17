import { useId } from 'react'

/**
 * Generates a unique ID for form inputs
 * Priority: id prop > name prop > generated unique ID
 *
 * @param id - Optional explicit ID
 * @param name - Optional name (used as fallback)
 * @param prefix - Optional prefix for generated IDs (default: 'input')
 * @returns A unique ID string
 */
export const useInputId = (id?: string, name?: string, prefix: string = 'input'): string => {
  const generatedId = useId()
  return id || name || `${prefix}-${generatedId}`
}
