import { useContext } from 'react'
import { CTXAxios, InstanceProps } from '../context/apiContext'

export const useAPICtx = (): InstanceProps => useContext(CTXAxios)
