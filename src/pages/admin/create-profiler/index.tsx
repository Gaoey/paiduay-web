// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import

// ** MUI Components
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { SubmitHandler } from 'react-hook-form'
import { useAdminAccount } from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'
import { Media } from 'src/@core/types'
import { ProfilerData } from 'src/@core/types/profiler'
import ProfilerForm from 'src/views/admin/ProfilerForm'

const CreateProfiler = () => {
  // ** Hooks
  const router = useRouter()

  const { mediaAPI, profilerAPI } = useApi()
  const { createProfiler } = profilerAPI
  const { uploadMedias } = mediaAPI

  const { isSuccess, isAdmin } = useAdminAccount()

  const { isSuccess: isCreateProfilerSuccess, isLoading: isCreateProfilerLoading } = createProfiler
  const { isLoading: isUploadMediasLoading } = uploadMedias

  // ** Effects
  useEffect(() => {
    if (isSuccess && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isAdmin, isSuccess, router])

  const onSubmit: SubmitHandler<any> = async data => {
    const profilerData: ProfilerData = {
      name: data?.name,
      description: data?.description,
      bank_accounts: data?.bank_accounts || [],
      contacts: data?.contacts || []
    }

    const media: Media | undefined = R.pathOr<Media | undefined>(undefined, ['logo_image'], data)
    if (!R.isNil(media)) {
      const newMedias: Media[] = await uploadMedias.mutateAsync([media])
      profilerData.logo_image = newMedias[0]
    }

    createProfiler.mutate(profilerData)
  }

  // ** Effects
  useEffect(() => {
    if (isCreateProfilerSuccess) {
      router.push('/admin/dashboard')
    }
  }, [isCreateProfilerSuccess, router])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5 }}>
        <ProfilerForm
          onSubmit={onSubmit}
          title={'สร้างทริปของคุณ'}
          isLoading={isUploadMediasLoading || isCreateProfilerLoading}
        />
      </Box>
    </Box>
  )
}

CreateProfiler.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default CreateProfiler
