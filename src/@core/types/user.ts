import { Media } from '.'

export enum UserRole {
  TRIPMAKER = 'TRIPMAKER',
  USER = 'USER'
}

export enum TripMakerRole {
  Admin = 'Admin',
  Staff = 'Staff'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNSPECIFIED = 'UNSPECIFIED'
}

export interface UserProfile {
  role?: UserRole | null
  trip_maker_role?: TripMakerRole | null
  profiler_id?: string | null
  first_name: string
  last_name: string
  citizen_id: string
  citizen_card_image?: Media | null
  passport_id?: string | null
  passport_card_image?: Media | null
  address: string
  telephone_number: string
  beneficiary_name?: string | null
  gender?: Gender | null
}

export interface User {
  _id: string
  name: string
  profile_image?: string | null
  google_id?: string | null
  email?: string | null
  profile?: UserProfile | null
  created_at: Date
  updated_at: Date
}
