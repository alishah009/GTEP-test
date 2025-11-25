import { Role } from '@/enum/User'

export type User = {
  id: string
  email?: string
  full_name?: string
  role?: Role
  created_at?: string
  password?: string
  photo_url?: string
}
