import { Media } from '.'
import { Contact } from './profiler'

export interface Location {
  title: string
  description?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface PaymentData {
  full_price: number
  deposit_price?: number | null
  payment_date: Date
}

export interface TripMember {
  user_id: string // Assuming UUID is a string in TypeScript
  status: MemberStatus
}

export interface TripData {
  title: string
  description: string
  cover_images: Media[]
  date_to_reserve: Date
  from_date: Date
  to_date: Date
  going_date: Date
  payment?: PaymentData | null
  total_people: number
  members: TripMember[]
  locations: Location[]
  contacts: Contact[]
  status: TripStatus
}

export enum MemberStatus {
  Interest,
  Going,
  NotInterest
}

export enum TripStatus {
  Full,
  NotFull,
  NotAvailable
}

export interface TripFilter {
  from_date?: Date | null
  to_date?: Date | null
  location?: string | null
  from_price?: number | null
  to_price?: number | null
}

export interface Trip {
  id: string
  data: TripData
  profiler_id: string
  created_by_user_id: string
  is_deleted: boolean
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}
