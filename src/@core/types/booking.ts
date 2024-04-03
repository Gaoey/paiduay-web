import { Media } from '.'
import { Trip } from './trip'
import { UserProfile } from './user'

export enum BookingStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  PAID = 'PAID',
  CONFIRM = 'CONFIRM',
  FAILED = 'FAILED'
}

export interface BookingData {
  user_id: string
  transport_id: string
  seat_name: string
  seat_number: number
  status: BookingStatus | string
  slips: Media[]
  user_info?: UserProfile
}

export interface Booking {
  _id: string
  trip_id: string
  data: BookingData
  trip_data?: Trip | undefined
  created_at: Date
  updated_at: Date
}

export interface BookingFilter {
  is_passed?: boolean
  status?: BookingStatus | string
  trip_id?: string
}
