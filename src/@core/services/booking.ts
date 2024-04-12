import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Booking, BookingData, BookingFilter } from '../types/booking'
import { Paginate } from '../types'

const bookingAPI = (authIntance: AxiosInstance) => ({
  createBooking: ({ tripID, params }: { tripID: string; params: BookingData }): Promise<Booking> => {
    return authIntance.post(`/v1/trips/${tripID}/bookings`, params)
  },
  updateBooking: ({
    bookingID,
    tripID,
    params
  }: {
    bookingID: string
    tripID: string
    params: BookingData
  }): Promise<Booking> => {
    return authIntance.put(`/v1/trips/${tripID}/bookings/${bookingID}`, params)
  },
  findBookings: ({ filters, paginate }: { filters: BookingFilter; paginate: Paginate }): Promise<Booking[]> => {
    return authIntance.post(`/v1/bookings?page_size=${paginate.page_size}&page_number=${paginate.page_number}`, filters)
  },
  findBookingByID: (id: string): Promise<Booking> => {
    return authIntance.get(`/v1/bookings/${id}`)
  },
  findBookingsByUserID: ({ paginate }: { paginate: Paginate }): Promise<Booking[]> => {
    return authIntance.post(`/v1/bookings/user?page_size=${paginate.page_size}&page_number=${paginate.page_number}`, {})
  }
})

function useBookingAPI({ authInstance }: InstanceProps) {
  const api = bookingAPI(authInstance)

  const createBooking = useMutation(api.createBooking)
  const updateBooking = useMutation(api.updateBooking)
  const findBookings = useMutation(api.findBookings)
  const findBookingsByUserID = useMutation(api.findBookingsByUserID)
  const findBookingByID = useMutation(api.findBookingByID)

  return {
    createBooking,
    findBookings,
    updateBooking,
    findBookingsByUserID,
    findBookingByID
  }
}

export default useBookingAPI
