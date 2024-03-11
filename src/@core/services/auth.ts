import { AxiosInstance, AxiosRequestConfig } from 'axios'

const auth = (axios: AxiosInstance) => ({
  login: (option?: AxiosRequestConfig) => {
    return axios({
      method: 'post',
      url: `/v1/auth/login`,
      ...option
    })
  }
})

export default auth
