import { LoadingButton } from '@mui/lab'
import { Grid, Paper, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useApi } from 'src/@core/services'
import { User, UserProfile } from 'src/@core/types/user'

interface Props {
  user: User
}

export default function UpdateProfileForm(props: Props) {
  const { user } = props
  const router = useRouter()

  const { userAPI } = useApi()
  const { updateProfile } = userAPI

  const { isSuccess, isLoading } = updateProfile

  const defaultValues = {
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    citizen_id: user?.profile?.citizen_id || '',
    citizen_card_image: user?.profile?.citizen_card_image || null,
    passport_id: user?.profile?.passport_id || '',
    passport_card_image: user?.profile?.passport_card_image || null,
    address: user?.profile?.address || '',
    telephone_number: user?.profile?.telephone_number || '',
    line_contacts: user?.profile?.line_contacts || ''
  }

  const { register, handleSubmit } = useForm<UserProfile>({
    defaultValues
  })

  const onSubmit: SubmitHandler<any> = data => {
    const {
      first_name: name,
      last_name: surname,
      telephone_number: tel,
      line_contacts: line
    } = data
    if (!name || !surname || !tel || !line ){
      
    }
    const profile: UserProfile = {
      ...user?.profile,
      ...data
    }

    updateProfile.mutate(profile)
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/user/${user?._id}`)
    }
  }, [isSuccess])

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item md={12}>
            <Typography variant='h5' gutterBottom>
              Update User Profile
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='ชื่อ' fullWidth {...register('first_name', { required: 'โปรดใส่ชื่อ' })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='นามสกุล' fullWidth {...register('last_name', { required: 'โปรดใส่นามสกุล' })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type='number'
              onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
              label='เลขบัตรประชาชน'
              inputProps={{ pattern: "^[0-9]*$" }}
              fullWidth
              {...register('citizen_id', { required: 'โปรดเลขบัตรประชาชน' })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='ที่อยู่' fullWidth {...register('address')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type='tel'
              inputProps={{ pattern: "^[0-9]*$" }}
              label='เบอร์โทร'
              fullWidth
              {...register('telephone_number', { required: 'โปรดใส่เบอร์ดิดต่อ' })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Line ID' fullWidth {...register('line_contacts', { required: 'โปรดใส่ LINE id' })} />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton type='submit' variant='contained' color='primary' loading={isLoading}>
              บันทึก
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
