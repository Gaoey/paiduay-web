import axios from 'axios'
import { useAPICtx } from '../hooks/useAPICtx'
import useBookingAPI from './booking'
import useMediaAPI from './media'
import useNotificationAPI from './notification'
import useProfilerAPI from './profiler'
import useTransportAPI from './transport'
import useTripAPI from './trip'
import useUserAPI from './user'

const axiosInstance = (
  accessToken = '',
  baseURL = process.env.NEXT_PUBLIC_CORE_API || 'https://api.waarn.finance/paiduay-core'
) => {
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
    bookingAPI: useBookingAPI(ctx),
    notificationAPI: useNotificationAPI(ctx)
  }
}

export default axiosInstance
