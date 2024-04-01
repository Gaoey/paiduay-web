import { AxiosInstance } from 'axios'
import * as R from 'ramda'
import { useMutation, useQueryClient } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { User, UserProfile } from '../types/user'
import { useSession } from 'next-auth/react'

const userAPI = (authIntance: AxiosInstance) => ({
  getUser: (): Promise<User> => {
    return authIntance.get(`/v1/user`)
  },
  updateProfile: (body: UserProfile): Promise<boolean> => {
    return authIntance.put(`/v1/user`, body)
  }
})

function useUserAPI({ authInstance }: InstanceProps) {
  const queryClient = useQueryClient()
  const api = userAPI(authInstance)

  const session = useSession()
  console.log({ session })

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

  return {
    user,
    getUser: userCache,
    updateProfile,
    isLogin: session.status === 'authenticated'
  }
}

export default useUserAPI
