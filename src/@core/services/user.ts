import { AxiosInstance } from 'axios'
import { useAPI } from '../hooks/useAPI'
import { useMutation } from 'react-query'
import { ResponseFormat } from '../types'
import { User, UserProfile } from '../types/user'

const userAPI = (authIntance: AxiosInstance) => ({
  getUser: (): Promise<ResponseFormat<User>> => {
    return authIntance.get(`/v1/user`)
  },
  updateProfile: (body: UserProfile): Promise<ResponseFormat<boolean>> => {
    return authIntance.put(`/v1/user`, body)
  }
})

function useUserAPI() {
  const { authInstance } = useAPI()
  const api = userAPI(authInstance)

  const getUser = useMutation(api.getUser)
  const updateProfile = useMutation(api.updateProfile)

  return {
    getUser,
    updateProfile
  }
}

export default useUserAPI
