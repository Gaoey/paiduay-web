import { AxiosInstance } from 'axios'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import axiosInstance from 'src/@core/services'

export type InstanceProps = {
  instance: AxiosInstance
  authInstance: AxiosInstance
  uid: string
  accessToken: string
}

export const CTXAxios = React.createContext<InstanceProps>({} as InstanceProps)

const APIProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session }: any = useSession()
  const accessToken: string = session?.accessToken || ''
  const instanceAuth: AxiosInstance = axiosInstance(accessToken)
  const instance: AxiosInstance = axiosInstance()

  const props: InstanceProps = {
    authInstance: instanceAuth,
    instance,
    uid: session?.id,
    accessToken
  }

  return <CTXAxios.Provider value={props}>{children}</CTXAxios.Provider>
}

export default APIProvider
