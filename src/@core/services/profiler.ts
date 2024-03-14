import { AxiosInstance } from 'axios'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { ResponseFormat } from '../types'
import { Profiler, ProfilerData } from '../types/profiler'

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
  const api = profilerAPI(authInstance)

  const createProfiler = useMutation(api.createProfiler)
  const findProfilerByProfilerID = useMutation(api.findProfilerByProfilerID)
  const findProfiler = useMutation(api.findProfiler)
  const updateProfiler = useMutation(api.updateProfiler)

  return {
    createProfiler,
    findProfilerByProfilerID,
    findProfiler,
    updateProfiler
  }
}

export default useProfilerAPI
