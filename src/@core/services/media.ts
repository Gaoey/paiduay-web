import { AxiosInstance } from 'axios'
import * as R from 'ramda'
import { useMutation } from 'react-query'
import { InstanceProps } from '../context/apiContext'
import { Media } from '../types'

const createFormData = (data: Media[]): FormData => {
  const formData = new FormData()
  data.forEach(d => {
    if (!R.isNil(d.file)) {
      formData.append('images', d.file)
    }
  })

  return formData
}

const mediaAPI = (authIntance: AxiosInstance) => ({
  upload: (medias: Media[]): Promise<Media[]> => {
    const bucketName = medias[0].bucket_name
    const formData: FormData = createFormData(medias)

    return authIntance.post(`/v1/medias/upload?bucket_name=${bucketName}`, formData)
  },
  getUploadSignURL: (media: Media[]): Promise<Media[]> => authIntance.post(`/v1/medias/upload_signed_url`, media),
  getDownloadSignURL: (media: Media[]): Promise<Media[]> => authIntance.post(`/v1/medias/get_signed_url`, media),
  uploadToGCSFromSignedURL: ({ media, b }: { media: Media; b: Blob }): Promise<any> =>
    authIntance.put(`${media.signed_url}`, b)
})

function useMediaAPI({ authInstance }: InstanceProps) {
  const api = mediaAPI(authInstance)

  const getUploadSignURL = useMutation(api.getUploadSignURL)
  const getDownloadSignURL = useMutation(api.getDownloadSignURL)
  const uploadToGCSFromSignedURL = useMutation(api.uploadToGCSFromSignedURL)
  const uploadMedias = useMutation(api.upload)

  return {
    getUploadSignURL,
    getDownloadSignURL,
    uploadToGCSFromSignedURL,
    uploadMedias
  }
}

export default useMediaAPI
