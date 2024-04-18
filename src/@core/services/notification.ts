import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { INotification, NotificationData } from '../theme/notification'
import { Paginate } from '../types'

const notificationAPI = (authIntance: AxiosInstance) => ({
  updateNotification: ({
    notificationID,
    params
  }: {
    notificationID: string
    params: NotificationData
  }): Promise<boolean> => {
    return authIntance.put(`/v1/notifications/${notificationID}`, params)
  },

  getNotifications: ({ paginate }: { paginate: Paginate }): Promise<INotification[]> => {
    return authIntance.get(`/v1/notifications?page_size=${paginate.page_size}&page_number=${paginate.page_number}`, {})
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
