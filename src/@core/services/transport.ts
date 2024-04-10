import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Seat, Transport, TransportData } from '../types/transport'

const transportAPI = (authIntance: AxiosInstance) => ({
  createTransport: ({
    tripID,
    transportData
  }: {
    tripID: string
    transportData: TransportData[]
  }): Promise<Transport[]> => {
    return authIntance.post(`/v1/trips/${tripID}/transports`, transportData)
  },
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
  updateTransport: ({
    tripID,
    transportID,
    transportData
  }: {
    tripID: string
    transportID: string
    transportData: TransportData
  }): Promise<boolean> => {
    return authIntance.put(`/v1/trips/${tripID}/transports/${transportID}`, transportData)
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
  const updateTransport = useMutation(api.updateTransport)
  const createTransport = useMutation(api.createTransport)

  return {
    findTransportByTripID,
    updateSeatByTransportID,
    removeTransport,
    updateTransport,
    createTransport
  }
}

export default useTransportAPI
