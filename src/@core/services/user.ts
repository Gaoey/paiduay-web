import { AxiosInstance } from 'axios'
import { useAPI } from '../hooks/useAPI'
import { useMutation, useQueryClient } from 'react-query'
import { User, UserProfile } from '../types/user'
import * as R from 'ramda'

const userAPI = (authIntance: AxiosInstance) => ({
  getUser: (): Promise<User> => {
    return authIntance.get(`/v1/user`)
  },
  updateProfile: (body: UserProfile): Promise<boolean> => {
    return authIntance.put(`/v1/user`, body)
  }
})

function useUserAPI() {
  const queryClient = useQueryClient()
  const { authInstance } = useAPI()
  const api = userAPI(authInstance)

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
    updateProfile
  }
}

export default useUserAPI
