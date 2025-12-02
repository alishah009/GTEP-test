'use client'

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { createPortal } from 'react-dom'

type SpinnerContextValue = {
  showSpinner: (message?: string) => void
  hideSpinner: () => void
  isVisible: boolean
  message: string
}

const SpinnerContext = createContext<SpinnerContextValue | undefined>(undefined)

export function SpinnerProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('Loading')
  const showSpinner = useCallback((customMessage?: string) => {
    setMessage(customMessage?.trim() ? customMessage : 'Loading')
    setIsVisible(true)
  }, [])

  const hideSpinner = useCallback(() => {
    setIsVisible(false)
  }, [])

  const value = useMemo(
    () => ({
      showSpinner,
      hideSpinner,
      isVisible,
      message
    }),
    [hideSpinner, isVisible, message, showSpinner]
  )

  return (
    <SpinnerContext.Provider value={value}>
      {children}
      {isVisible ? <SpinnerOverlay message={value.message} /> : null}
    </SpinnerContext.Provider>
  )
}

export function useSpinner() {
  const context = useContext(SpinnerContext)
  if (!context) {
    throw new Error('useSpinner must be used within SpinnerProvider')
  }
  return context
}

const SpinnerOverlay = ({ message }: { message: string }) => {
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const dots = '.'.repeat(dotCount).padEnd(3, ' ')

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='flex flex-col items-center rounded-2xl bg-white/90 px-10 py-8 shadow-2xl'>
        <span className='mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent' />
        <p className='text-lg font-semibold text-gray-800'>
          {message}
          <span className='inline-block w-6'>{dots}</span>
        </p>
      </div>
    </div>,
    document.body
  )
}
