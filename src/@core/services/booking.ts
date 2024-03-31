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
  }
})

function useBookingAPI({ authInstance }: InstanceProps) {
  const api = bookingAPI(authInstance)

  const createBooking = useMutation(api.createBooking)
  const updateBooking = useMutation(api.updateBooking)
  const findBookings = useMutation(api.findBookings)

  return {
    createBooking,
    findBookings,
    updateBooking
  }
}

export default useBookingAPI
