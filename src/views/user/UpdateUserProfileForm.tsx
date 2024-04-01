import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { User, UserProfile } from 'src/@core/types/user'

interface Props {
  user: User
}

export default function UpdateProfileForm(props: Props) {
  const { user } = props
  const router = useRouter()

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

  const onSubmit: SubmitHandler<any> = (data: UserProfile) => {
    console.log(data) // Handle form submission
    router.push(`/user/${user?._id}`)
  }

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
            <TextField label='First Name' fullWidth {...register('first_name')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Last Name' fullWidth {...register('last_name')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Citizen ID' fullWidth {...register('citizen_id')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Address' fullWidth {...register('address')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Telephone Number' fullWidth {...register('telephone_number')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Line ID' fullWidth {...register('line_contacts')} />
          </Grid>
          <Grid item xs={12}>
            <Button type='submit' variant='contained' color='primary'>
              UPDATE
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
