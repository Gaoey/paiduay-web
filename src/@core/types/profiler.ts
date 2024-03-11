import { Media } from '.'

export interface BankAccount {
  bank_title: string
  account_number: string
}

export interface ProfilerData {
  name: string
  description: string
  bank_accounts: BankAccount[]
  logo_image?: Media
  cover_image?: Media
}

export interface Profiler {
  _id: string
  data: ProfilerData
  created_by_user_id: string
  follower_count: number
  review_count: number
  created_at: Date
  updated_at: Date
}
