'use client'

import { useAuth } from '@/context/AuthContext'

export default function Page() {
  const { user, loading, logout } = useAuth()

  if (loading) return <p>Loading...</p>
  console.log('user', user)
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold'>Dashboard</h1>

      <p className='mt-4 text-lg'>Hello, {user?.full_name}</p>

      <button onClick={logout} className='mt-6 rounded bg-red-600 px-4 py-2 text-white'>
        Logout
      </button>
    </div>
  )
}
