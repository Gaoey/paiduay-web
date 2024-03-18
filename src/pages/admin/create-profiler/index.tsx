// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import

// ** MUI Components
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

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
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import ProfilerForm from 'src/views/admin/ProfilerForm'

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0
  }
}))

const CreateProfiler = () => {
  // ** Hooks
  const router = useRouter()

  const { mediaAPI, profilerAPI } = useApi()
  const { createProfiler } = profilerAPI
  const { uploadMedias } = mediaAPI

  const { isSuccess, isAdmin } = useAdminAccount()

  const { isSuccess: isCreateProfilerSuccess } = createProfiler

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
      contacts: []
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
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <ProfilerForm onSubmit={onSubmit} title={'Create Profiler'} />
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />} />
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
