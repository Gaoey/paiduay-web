// ** React Imports
import { ReactNode, useEffect, useRef, useState } from 'react'
import gsap from 'gsap';

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

const PathBackground = () => {
  const pathRef = useRef<any>(null)
  const [pathLength, setPathLength] = useState(0);
  
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength()); 
    }
  }, []);

  useEffect(() => {
    if (pathLength) {
      gsap.fromTo(pathRef.current, {
        strokeDashoffset: pathLength 
      }, {
        strokeDashoffset: 0, 
        duration: 5,
        ease: 'power2.out'
      }); 
    }
  }, [pathLength]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0em',
        margin: '0',
        width: '100vw',
        display: 'flex'
      }}
    >
      <svg id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 940.23 351.95' style={{ width: '100%' }}>
        <path
          className='cls-1'
          style={{
            fill: 'none',
            stroke: '#3B5249',
            strokeLinecap: 'round',
            strokeMiterlimit: '10',
            strokeWidth: '10px',
            width: '100%',
            opacity: '0.1'
          }}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
          ref={pathRef}
          d='M-.25,316.78c74.54-51.39,103.91,18.64,158.12,20.33s-13.55-126.49,63.25-161.51,102.78,94.31,157.55,101.08,56.6-90.97,56.6-90.97c0,0,2.32-22.46-2.32-60.4-4.65-37.95,6.97-54.21,27.1-53.43,20.13.77,3.96,57.28,17.27,58.14,6.37.41,1.92-26.71,8.89-36,6.97-9.29,21.81-10.6,19.48,11.86-2.32,22.46-1.26,30.63,3.39,27.53,4.65-3.1,4.82-22.69,9.32-27.95,5.01-5.86,13-6.68,16.09,3.39,3.1,10.07-5.52,31.19-.88,30.41s7.74-21.68,11.62-24.78c3.87-3.1,9.29-4.65,10.84,4.65s-6.97,24.78-3.87,25.56,6.78-17.2,13.92-17.48c14.68-.56,6.43,35.77,5.22,42.64-1.27,7.2-2.12,12.71-14.49,43.76,0,0-40.4,88.5,19.46,56.31S705.06,46.85,763.79,23.14s70.02,9.04,107.86,20.33,68.33,12.99,68.33,12.99'
        />
      </svg>
    </div>
  )
}

const Success = () => {
  const { userAPI } = useApi()
  const { user } = userAPI
  const { data: userData } = user

  useEffect(() => {
    user.mutate()
  }, [])

  return (
    <Box className='content-center' >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <BoxWrapper sx={{ padding: '4em 1em' }}>
          <Typography variant='h3' sx={{ mb: 4 }}>ดีใจด้วย!</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            การจองของคุณกำลังดำเนินการอยู่
          </Typography>
          <Typography variant='body2'>โปรดรอทางทริปลีดเดอร์ของคุณคอนเฟิร์มในหน้าโปรไฟล์ของคุณ</Typography>
        </BoxWrapper>
        <Link passHref href={`/user/${userData?._id}/`}>
          <Button component='a' variant='contained' sx={{ px: 5.5 }}>
            ไปหน้าหลัก
          </Button>
        </Link>
      </Box>
      <PathBackground />
    </Box>
  )
}

Success.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export default Success
