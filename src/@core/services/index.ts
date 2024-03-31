import axios from 'axios'
import { useAPICtx } from '../hooks/useAPICtx'
import useProfilerAPI from './profiler'
import useMediaAPI from './media'
import useUserAPI from './user'
import useTripAPI from './trip'
import useTransportAPI from './transport'
import useBookingAPI from './booking'

const axiosInstance = (accessToken = '', baseURL = process.env.NEXT_PUBLIC_CORE_API) => {
  const instance = axios.create({
    baseURL
  })
  instance.interceptors.request.use(
    function (config: any) {
      if (accessToken) {
        config.headers.Authorization = accessToken
      }

      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  instance.interceptors.response.use(
    function (response) {
      return response?.data
    },
    function (error) {
      return Promise.reject(error?.response)
    }
  )

  return instance
}

export const useApi = () => {
  const ctx = useAPICtx()
  if (!ctx) {
    throw new Error('useApi must be used within an CTXAxios.Provider')
  }

  return {
    profilerAPI: useProfilerAPI(ctx),
    mediaAPI: useMediaAPI(ctx),
    userAPI: useUserAPI(ctx),
    tripAPI: useTripAPI(ctx),
    transportAPI: useTransportAPI(ctx),
    bookingAPI: useBookingAPI(ctx)
  }
}

export default axiosInstance
