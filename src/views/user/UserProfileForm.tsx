import { Avatar, Badge, Box, Button, Card, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect } from 'react'
import { BadgeContentSpan } from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'
import { User } from 'src/@core/types/user'

interface Props {
  userID: string
}

export default function UserProfileForm(props: Props) {
  const { userID } = props

  const router = useRouter()
  const { userAPI } = useApi()
  const { getUserById, user: getUser } = userAPI

  const { data } = getUserById
  const { data: currUserData } = getUser
  const currUser: User | undefined = R.pathOr<User | undefined>(undefined, [], currUserData)
  const user: User | undefined = R.pathOr<User | undefined>(undefined, [], data)

  useEffect(() => {
    getUser.mutate()
    getUserById.mutate(userID)
  }, [])

  return (
    <Card sx={{ padding: 10 }}>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap='circular'
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar
                  alt='profile img'
                  src={user?.profile_image || '/images/avatars/1.png'}
                  sx={{ width: '2.5rem', height: '2.5rem' }}
                />
              </Badge>
              <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  User
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>First Name:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.first_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>Last Name:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.last_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>Citizen ID:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.citizen_id || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>Address:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.address || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>Telephone Number:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.telephone_number || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2'>LINE ID:</Typography>
              <Typography variant='subtitle1' color='secondary'>
                {user?.profile?.line_contacts || 'N/A'}
              </Typography>
            </Grid>
            {currUser?._id === user?._id && (
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => router.push(`/user/${currUser?._id}/update_profile`)}
                >
                  Update profile
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}
