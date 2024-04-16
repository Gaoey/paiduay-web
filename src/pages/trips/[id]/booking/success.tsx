// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useApi } from 'src/@core/services'

// ** Layout Import

// ** Demo Imports
import UserLayout from 'src/layouts/UserLayout'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0
  }
}))

const Success = () => {
  const { userAPI } = useApi()
  const { user } = userAPI
  const { data: userData } = user

  useEffect(() => {
    user.mutate()
  }, [])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h3'>ดีใจด้วย!</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            การจองของกำลังดำเนินการอยู่
          </Typography>
          <Typography variant='body2'>โปรดรอทางทริปลีดเดอร์ของคุณคอนเฟิร์มในหน้าโปรไฟล์ของคุณ</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/404.png' />
        <Link passHref href={`/user/${userData?._id}/`}>
          <Button component='a' variant='contained' sx={{ px: 5.5 }}>
            กลับหน้าหลัก
          </Button>
        </Link>
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />} />
    </Box>
  )
}

Success.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export default Success
