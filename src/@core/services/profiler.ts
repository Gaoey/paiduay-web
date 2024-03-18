import { AxiosInstance } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { ResponseFormat } from '../types'
import { Profiler, ProfilerData } from '../types/profiler'
import * as R from 'ramda'

const profilerAPI = (authIntance: AxiosInstance) => ({
  createProfiler: (params: ProfilerData): Promise<Profiler> => {
    return authIntance.post(`/v1/profilers`, params)
  },
  findProfilerByProfilerID: (profilerID: string): Promise<Profiler | null> => {
    return authIntance.get(`/v1/profilers/${profilerID}`)
  },
  findProfiler: (): Promise<Profiler[]> => {
    return authIntance.get(`/v1/profilers`)
  },
  updateProfiler: ({
    profilerID,
    profilerData
  }: {
    profilerID: string
    profilerData: ProfilerData
  }): Promise<ResponseFormat<Profiler | null>> => {
    return authIntance.put(`/v1/profilers/${profilerID}`, profilerData)
  }
})

function useProfilerAPI({ authInstance }: InstanceProps) {
  const queryClient = useQueryClient()
  const api = profilerAPI(authInstance)

  const profilerCache: Profiler[] = queryClient.getQueryData<Profiler[]>('profiler') as Profiler[]

  const getCurrentProfiler = async (): Promise<Profiler[]> => {
    if (R.isNil(profilerCache)) {
      const res: Profiler[] = await api.findProfiler()

      return res
    }

    return profilerCache
  }

  const createProfiler = useMutation(api.createProfiler)
  const findProfilerByProfilerID = useMutation(api.findProfilerByProfilerID)
  const findProfiler = useMutation(api.findProfiler, {
    onSuccess: async (resp: Profiler[]) => {
      if (R.isNil(profilerCache)) {
        queryClient.setQueryData('profiler', () => resp)
      }

      return resp
    },
    onError: error => {
      console.error({ error })
    }
  })
  const updateProfiler = useMutation(api.updateProfiler)
  const getCurrentProfilerMutation = useMutation(getCurrentProfiler)

  return {
    createProfiler,
    findProfilerByProfilerID,
    findProfiler,
    updateProfiler,
    getCurrentProfiler,
    getCurrentProfilerMutation
  }
}

export default useProfilerAPI
