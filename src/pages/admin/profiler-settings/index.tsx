// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import

// ** MUI Components

// ** Layout Import

// ** Demo Imports
import * as R from 'ramda'
import { SubmitHandler } from 'react-hook-form'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import { Media } from 'src/@core/types'
import { Profiler, ProfilerData } from 'src/@core/types/profiler'
import AdminLayout from 'src/layouts/AdminLayout'
import ProfilerForm from 'src/views/admin/ProfilerForm'
import { getSessionFromCookie } from 'src/@core/utils/session'

const UpdateProfiler = () => {
  // ** Hooks

  const { mediaAPI, profilerAPI } = useApi()
  const { updateProfiler, getCurrentProfilerMutation } = profilerAPI
  const { uploadMedias } = mediaAPI

  const { data: currentProfilerData } = getCurrentProfilerMutation
  const { isLoading: isUploadMediasLoading } = uploadMedias
  const { isLoading: isUpdateProfilerLoading } = updateProfiler
  useEffect(() => {
    getCurrentProfilerMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit: SubmitHandler<any> = async data => {
    if (!R.isNil(currentProfilerData) && !R.isEmpty(currentProfilerData)) {
      const profiler = currentProfilerData[0] as Profiler
      const profilerData: ProfilerData = {
        name: data?.name,
        description: data?.description,
        bank_accounts: data?.bank_accounts || [],
        contacts: data?.contacts || []
      }

      const media: Media | undefined = R.pathOr<Media | undefined>(undefined, ['logo_image'], data)
      if (!R.isNil(media) && R.isEmpty(data?.logo_image.signed_url)) {
        const newMedias: Media[] = await uploadMedias.mutateAsync([media])
        profilerData.logo_image = newMedias[0]
      }

      updateProfiler.mutate({ profilerID: profiler._id, profilerData })
    }
  }

  if (R.isNil(currentProfilerData) || R.isEmpty(currentProfilerData)) {
    return <LoadingComponent />
  }

  return (
    <ProfilerForm
      onSubmit={onSubmit}
      title='ตั้งค่าโปรไฟล์ของคุณ'
      profiler={!R.isNil(currentProfilerData) ? currentProfilerData[0] : undefined}
      isLoading={isUploadMediasLoading || isUpdateProfilerLoading}
    />
  )
}

UpdateProfiler.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}

export default UpdateProfiler
