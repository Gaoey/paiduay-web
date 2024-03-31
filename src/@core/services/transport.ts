import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Seat, Transport } from '../types/transport'

const transportAPI = (authIntance: AxiosInstance) => ({
  findTransportByTripID: (tripID: string): Promise<Transport[]> => {
    return authIntance.get(`/v1/trips/${tripID}/transports`)
  },
  updateSeatByTransportID: ({ transportID, seats }: { transportID: string; seats: Seat[] }): Promise<boolean> => {
    return authIntance.put(`/v1/transports/${transportID}`, seats)
  }
})

function useTransportAPI({ authInstance }: InstanceProps) {
  const api = transportAPI(authInstance)

  const findTransportByTripID = useMutation(api.findTransportByTripID)
  const updateSeatByTransportID = useMutation(api.updateSeatByTransportID)

  return {
    findTransportByTripID,
    updateSeatByTransportID
  }
}

export default useTransportAPI
