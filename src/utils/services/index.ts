import axios from 'axios'

const axiosInstance = (accessToken = '', baseURL = process.env.NEXT_PUBLIC_CORE_API) => {
  const instance = axios.create({
    baseURL
  })
  instance.interceptors.request.use(
    function (config: any) {
      config.headers['Content-Type'] = 'application/json'
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

export default axiosInstance
