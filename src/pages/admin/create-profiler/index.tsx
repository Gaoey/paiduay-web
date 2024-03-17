// ** React Imports
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Import

// ** MUI Components
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Avatar } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useAdminAccount } from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Profiler, ProfilerData } from 'src/@core/types/profiler'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

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
        <ProfilerForm onSubmit={onSubmit} />
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />} />
    </Box>
  )
}

interface ProfilerFormProps {
  profiler?: Profiler
  onSubmit: SubmitHandler<any>
}

function ProfilerForm(props: ProfilerFormProps) {
  const defaultValues = {
    name: props?.profiler?.data?.name || '',
    description: props?.profiler?.data?.description || '',
    logo_image: props?.profiler?.data?.logo_image || null,
    cover_image: props?.profiler?.data?.cover_image || null,
    bank_accounts: props?.profiler?.data?.bank_accounts || []
  }

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue
  } = useForm({
    defaultValues
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const target: File = e.target.files[0]
      setSelectedFile(target)
      const logoMedia: Media = {
        bucket_name: BUCKET_NAME,
        name: target.name,
        uri: '',
        signed_url: '',
        type: target.type,
        file: target
      }
      setValue('logo_image', logoMedia)
    }
  }

  return (
    <Card>
      <CardHeader title='Create Profiler' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <label htmlFor='avatar-input'>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: 5
                  }}
                >
                  {selectedFile ? (
                    <Avatar
                      alt='Selected Logo'
                      src={URL.createObjectURL(selectedFile)}
                      sx={{ width: 100, height: 100, marginTop: 2 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 100, height: 100, marginTop: 2 }}>
                      <CloudUploadIcon />
                    </Avatar>
                  )}
                </Box>
                <input
                  id='avatar-input'
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  {...register('logo_image')}
                  onChange={e => handleLogoFileChange(e)}
                />
                <Button variant='contained' component='span' startIcon={<CloudUploadIcon />}>
                  Upload Logo
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                rules={{
                  maxLength: {
                    value: 100,
                    message: 'max length 100 characters'
                  },
                  required: {
                    value: true,
                    message: 'name is required'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    fullWidth
                    label='Profiler name'
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={!R.isNil(errors.name)}
                    helperText={errors.name && errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{
                  maxLength: {
                    value: 1000,
                    message: 'max length 1000 characters'
                  },
                  required: {
                    value: true,
                    message: 'name is required'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Description'
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={!R.isNil(errors.description)}
                    helperText={errors.description && errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
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
