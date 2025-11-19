/**
 * Safely accesses nested error paths in react-hook-form errors object
 * Replaces the unsafe eval() pattern with a safe property accessor
 */
export function getNestedError(
  errors: Record<string, unknown> | undefined,
  name: string | undefined
): string | undefined {
  if (!errors || !name) return undefined

  // Split the path by dots and safely navigate through the object
  const pathParts = name.split('.')
  let current: unknown = errors

  for (const part of pathParts) {
    if (current && typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  // Return the message if it exists
  if (current && typeof current === 'object' && 'message' in current) {
    const message = (current as { message?: unknown }).message
    return typeof message === 'string' ? message : undefined
  }

  return undefined
}
