import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Trip, TripData, TripPayload } from '../types/trip'
import { Paginate } from '../types'

const tripAPI = (authIntance: AxiosInstance) => ({
  createTrip: ({ profilerID, params }: { profilerID: string; params: TripPayload }): Promise<Trip> => {
    return authIntance.post(`/v1/profilers/${profilerID}/trips`, params)
  },
  updateTrip: ({ tripID, params }: { tripID: string; params: TripData }): Promise<boolean> => {
    return authIntance.put(`/v1/trips/${tripID}`, params)
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
  const updateTrip = useMutation(api.updateTrip)
  const findTripByProfilerID = useMutation(api.findTripByProfilerID)
  const findTripByID = useMutation(api.findTripByID)

  return {
    updateTrip,
    createTrip,
    findTripByProfilerID,
    findTripByID
  }
}

export default useTripAPI
