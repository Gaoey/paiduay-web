import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Trip, TripData } from '../types/trip'
import { Paginate } from '../types'

const tripAPI = (authIntance: AxiosInstance) => ({
  createTrip: ({ profilerID, params }: { profilerID: string; params: TripData }): Promise<Trip> => {
    return authIntance.post(`/v1/profilers/${profilerID}/trips`, params)
  },
  findTripByProfilerID: ({ profilerID, paginate }: { profilerID: string; paginate: Paginate }): Promise<Trip[]> => {
    return authIntance.get(
      `/v1/profilers/${profilerID}/trips?page_size=${paginate.page_size}&page_number=${paginate.page_number}`
    )
  },
  findTripByID: (tripID: string): Promise<Trip> => {
    return authIntance.get(`/v1/trips/${tripID}`)
  }
})

function useTripAPI({ authInstance }: InstanceProps) {
  const api = tripAPI(authInstance)

  const createTrip = useMutation(api.createTrip)
  const findTripByProfilerID = useMutation(api.findTripByProfilerID)
  const findTripByID = useMutation(api.findTripByID)

  return {
    createTrip,
    findTripByProfilerID,
    findTripByID
  }
}

export default useTripAPI
