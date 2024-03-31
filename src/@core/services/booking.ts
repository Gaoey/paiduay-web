import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Booking, BookingData } from '../types/booking'

const bookingAPI = (authIntance: AxiosInstance) => ({
  createBooking: ({ tripID, params }: { tripID: string; params: BookingData }): Promise<Booking> => {
    return authIntance.post(`/v1/trips/${tripID}/bookings`, params)
  }
})

function useBookingAPI({ authInstance }: InstanceProps) {
  const api = bookingAPI(authInstance)

  const createBooking = useMutation(api.createBooking)

  return {
    createBooking
  }
}

export default useBookingAPI
