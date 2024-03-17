import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Trip, TripData } from '../types/trip'

const tripAPI = (authIntance: AxiosInstance) => ({
  createTrip: ({ profilerID, params }: { profilerID: string; params: TripData }): Promise<Trip> => {
    return authIntance.post(`/v1/profilers/${profilerID}/trips`, params)
  }
})

function useTripAPI({ authInstance }: InstanceProps) {
  const api = tripAPI(authInstance)

  const createTrip = useMutation(api.createTrip)

  return {
    createTrip
  }
}

export default useTripAPI
