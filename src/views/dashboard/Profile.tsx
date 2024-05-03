// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { LoadingComponent } from 'src/@core/components/loading'
import { Profiler } from 'src/@core/types/profiler'
import { User } from 'src/@core/types/user'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the Profile image
const ProfileImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 50,
  position: 'absolute'
})

interface ProfileProps {
  profiler: Profiler | null
  isLoading: boolean
  currentUser: User
}

const Profile = (props: ProfileProps) => {
  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const { isLoading, profiler, currentUser } = props

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        {isLoading && R.isNil(profiler) ? (
          <LoadingComponent />
        ) : (
          <>
            <Typography variant='h6'>หวัดดีเพื่อน {currentUser?.name}!</Typography>
            <Typography variant='body2' sx={{ letterSpacing: '0.25px', marginBottom: '2em' }}>
              {profiler?.data ? profiler.data.description.slice(0, 100) + '...' : 'คำแนะนำตัวของคุณ'}
            </Typography>
            <Button size='small' variant='contained' onClick={() => router.push('/admin/profiler-settings')}>
              อัพเดต
            </Button>
            <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
            {!R.isNil(profiler) && <ProfileImg alt='Profile' src={profiler.data.logo_image?.signed_url} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default Profile
