import { AxiosInstance } from 'axios'
import * as R from 'ramda'
import { useMutation, useQueryClient } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { User, UserProfile } from '../types/user'
import { useSession } from 'next-auth/react'

const userAPI = (authIntance: AxiosInstance) => ({
  getUserById: (userID: string): Promise<User> => {
    return authIntance.get(`/v1/user/${userID}`)
  },
  getUser: (): Promise<User> => {
    return authIntance.get(`/v1/user`)
  },
  updateProfile: (body: UserProfile): Promise<boolean> => {
    return authIntance.put(`/v1/user/profile`, body)
  },
  ping: () => {
    return authIntance.get('')
  }
})

function useUserAPI({ authInstance }: InstanceProps) {
  const queryClient = useQueryClient()
  const api = userAPI(authInstance)

  const session = useSession()

  const userCache: User | undefined = queryClient.getQueryData<User | undefined>('user') as User

  const getCurrentUser = async (): Promise<User> => {
    if (R.isNil(userCache)) {
      const res: User = await api.getUser()

      return res
    }

    return userCache
  }

  const user = useMutation(getCurrentUser, {
    onSuccess: async (resp: User) => {
      if (R.isNil(userCache) || userCache._id !== resp._id) {
        queryClient.setQueryData('user', () => resp)
      }

      return resp
    },
    onError: error => {
      console.error({ error })
    }
  })

  const updateProfile = useMutation(api.updateProfile)
  const getUserById = useMutation(api.getUserById)
  const healthcheck = useMutation(api.ping)

  return {
    user,
    getUser: userCache,
    getUserById,
    updateProfile,
    isLogin: session.status === 'authenticated',
    healthcheck
  }
}

export default useUserAPI
