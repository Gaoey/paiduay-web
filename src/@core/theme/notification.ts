export enum NotificationType {
  Booking = 'Booking',
  UpdateBooking = 'UpdateBooking',
  NewTrip = 'NewTrip',
  News = 'News',
  FeatureUpdate = 'FeatureUpdate'
}

export interface NotificationData {
  type: NotificationType
  user_id: string
  customer_id?: string
  trip_id?: string
  profiler_id?: string
  booking_id?: string
  message: string
  is_read: boolean
}

export interface Notification {
  id: string
  data: NotificationData
  created_at: Date
  updated_at: Date
}
