import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Transport } from '../types/transport'

const transportAPI = (authIntance: AxiosInstance) => ({
  findTransportByTripID: (tripID: string): Promise<Transport[]> => {
    return authIntance.get(`/v1/trips/${tripID}/transports`)
  }
})

function useTransportAPI({ authInstance }: InstanceProps) {
  const api = transportAPI(authInstance)

  const findTransportByTripID = useMutation(api.findTransportByTripID)

  return {
    findTransportByTripID
  }
}

export default useTransportAPI
