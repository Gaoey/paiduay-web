import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Seat, Transport } from '../types/transport'

const transportAPI = (authIntance: AxiosInstance) => ({
  findTransportByTripID: (tripID: string): Promise<Transport[]> => {
    return authIntance.get(`/v1/trips/${tripID}/transports`)
  },
  updateSeatByTransportID: ({
    tripID,
    transportID,
    seats
  }: {
    tripID: string
    transportID: string
    seats: Seat[]
  }): Promise<boolean> => {
    return authIntance.put(`/v1/trips/${tripID}/transports/${transportID}/seats`, seats)
  },
  removeTransport: ({ tripID, transportID }: { tripID: string; transportID: string }): Promise<boolean> => {
    return authIntance.delete(`/v1/trips/${tripID}/transports/${transportID}`)
  }
})

function useTransportAPI({ authInstance }: InstanceProps) {
  const api = transportAPI(authInstance)

  const findTransportByTripID = useMutation(api.findTransportByTripID)
  const updateSeatByTransportID = useMutation(api.updateSeatByTransportID)
  const removeTransport = useMutation(api.removeTransport)

  return {
    findTransportByTripID,
    updateSeatByTransportID,
    removeTransport
  }
}

export default useTransportAPI
