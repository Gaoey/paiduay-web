// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import { signIn } from 'next-auth/react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import GoogleIcon from '@mui/icons-material/Google'

// ** Icons Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useRouter } from 'next/router'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LoginPage = () => {
  const { query } = useRouter()
  const callback = (query?.callback as string) || '/'

  const handleSingIn = async () => {
    try {
      const res = await signIn('google', { callbackUrl: callback })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <Button variant='contained' startIcon={<GoogleIcon />} onClick={async () => await handleSingIn()}>
            Google Signin
          </Button>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
