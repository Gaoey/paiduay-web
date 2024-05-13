import { Media } from '.'
import { Contact, Profiler } from './profiler'
import { TransportData } from './transport'

export interface Location {
  title: string
  description?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface PaymentData {
  full_price: number
  accumulate_price?: number | null
  deposit_price?: number | null
  payment_date: Date
}

export interface TripMember {
  user_id: string // Assuming UUID is a string in TypeScript
  status: MemberStatus
  user_data: any
}

export interface TripData {
  title: string
  description: string
  cover_images: Media[]
  date_to_reserve: Date
  from_date: Date
  to_date: Date
  payment?: PaymentData | null
  total_people: number
  members: TripMember[]
  locations: Location[]
  contacts: Contact[]
  status: TripStatus | string
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
  is_filter_going_date: boolean
}

export interface Trip {
  _id: string
  data: TripData
  profiler?: Profiler | null
  profiler_id: string
  created_by_user_id: string
  is_deleted: boolean
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface TripPayload {
  trip_data: TripData
  transport_data: TransportData[]
}
