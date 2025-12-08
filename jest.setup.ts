import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Suppress React act() warnings from react-hook-form internal state updates
// These warnings are common when using react-hook-form in tests and don't affect functionality
// They occur because react-hook-form's internal state updates happen asynchronously
const originalError = console.error
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('not wrapped in act(...)') ||
        (args[0].includes('An update to') && args[0].includes('inside a test')))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
