import { useContext } from 'react'
import { CTXAxios, InstanceProps } from '../context/apiContext'

export const useAPI = (): InstanceProps => useContext(CTXAxios)
