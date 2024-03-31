import { Media } from '.'
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
  id: string
  trip_id: string
  data: BookingData
  created_at: Date
  updated_at: Date
}
