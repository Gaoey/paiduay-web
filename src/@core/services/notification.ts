import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { NotificationData } from '../theme/notification'
import { Paginate } from '../types'
import { Booking } from '../types/booking'

const notificationAPI = (authIntance: AxiosInstance) => ({
  updateNotification: ({
    notificationID,
    params
  }: {
    notificationID: string
    params: NotificationData
  }): Promise<Booking> => {
    return authIntance.put(`/v1/notifications/${notificationID}}`, params)
  },

  getNotifications: ({ paginate }: { paginate: Paginate }): Promise<Booking[]> => {
    return authIntance.post(`/v1/notifications?page_size=${paginate.page_size}&page_number=${paginate.page_number}`, {})
  }
})

function useNotificationAPI({ authInstance }: InstanceProps) {
  const api = notificationAPI(authInstance)

  const updateNotification = useMutation(api.updateNotification)
  const getNotifications = useMutation(api.getNotifications)

  return {
    updateNotification,
    getNotifications
  }
}

export default useNotificationAPI
