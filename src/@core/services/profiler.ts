import { AxiosInstance } from 'axios'
import { useAPI } from '../hooks/useAPI'
import { useMutation } from 'react-query'
import { ResponseFormat } from '../types'
import { Profiler, ProfilerData } from '../types/profiler'

const profilerAPI = (authIntance: AxiosInstance) => ({
  createProfiler: (params: ProfilerData): Promise<ResponseFormat<Profiler>> => {
    return authIntance.post(`/v1/profilers`, params)
  },
  findProfilerByProfilerID: (profilerID: string): Promise<ResponseFormat<Profiler | null>> => {
    return authIntance.get(`/v1/profilers/${profilerID}`)
  },
  findProfiler: (): Promise<ResponseFormat<Profiler[]>> => {
    return authIntance.get(`/v1/profilers}`)
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

function useProfilerAPI() {
  const { authInstance } = useAPI()
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
