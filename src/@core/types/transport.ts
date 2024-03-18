export interface Seat {
  seat_number: number
  user_id?: string | null
  is_lock: boolean
  status: SeatStatus | string
}

export enum SeatStatus {
  EMPTY,
  PENDING,
  SUCCESS
}

export enum Transportation {
  VAN,
  MINIBUS,
  BUS,
  PLANE,
  CAR4,
  CAR5,
  SELF
}

export interface TransportData {
  name: string
  transport_by: Transportation | string
  total_seats: number
  seats: Seat[]
}

export interface Transport {
  _id: string
  trip_id: string
  data: TransportData
  created_at: Date | string
  updated_at: Date | string
}
