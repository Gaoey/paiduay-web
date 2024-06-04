import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Parallax } from 'react-scroll-parallax'

const HowItWorksTraveller = () => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const imageContainerRef = useRef(null)

  useEffect(() => {
    const calculateDimensions = () => {
      if (imageContainerRef.current) {
        const containerWidth = (imageContainerRef.current as HTMLElement).offsetWidth
        const newImageWidth = containerWidth < 1000 ? Math.min(containerWidth, 500) : containerWidth / 3
        setImageDimensions({ width: newImageWidth, height: newImageWidth })
      }
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)

    return () => window.removeEventListener('resize', calculateDimensions)
  }, [])

  useEffect(() => {
    const imageContainers = document.querySelectorAll('.image-container')

    imageContainers.forEach(container => {
      gsap.to(container, {
        y: '-20', // Adjust for desired movement amount
        duration: 1,
        ease: 'ease-in-out',
        repeat: -1,
        yoyo: true
      })
    })
  }, [])

  return (
    <Container
      style={{
        overflow: 'hidden',
        maxWidth: '100vw',
        width: '100vw',
        alignItems: 'center',
        padding: '8em 0 8em 0'
      }}
    >
      <Grid container spacing={4} justifyContent='center' alignItems='center' style={{ height: '100%' }}>
        <Grid container ref={imageContainerRef} justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={12} style={{ height: '15vh' }}>
            <Parallax opacity={[0.5, 1]}>
              <Typography variant='h5' align='center' color='#FDECEF'>
                สำหรับ ลูกทริป
              </Typography>
              <Typography paragraph align='center' color='#FDECEF'>
                เตรียมพร้อมสำหรับการผจญภัยครั้งใหม่
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '60vh', display: 'flex', justifyContent: 'flex-start' }}>
            <Parallax translateY={[0, -50]}>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4em'
                }}
              >
                <Image
                  className='image-container'
                  src='/how_it_works_traveller_1.png'
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />

                <Typography variant='h5' align='center' color='#FDECEF'>
                  หาทริปง่ายๆ
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  ไม่ต้องคุยเยอะ ไม่ลืม รายละเอียดครบ
                </Typography>
              </div>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '60vh', display: 'flex', justifyContent: 'center' }}>
            <Parallax translateY={[0, -100]}>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4em'
                }}
              >
                <Image
                  className='image-container'
                  src='/how_it_works_traveller_2.png'
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />

                <Typography variant='h5' align='center' color='#FDECEF'>
                  จัดการทริปให้ไม่พลาด
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  จองที่นั่งรถ ใส่ข้อมูล cancel ทริป ทำง่ายๆผ่าน dashboard ของเรา
                </Typography>
              </div>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '60vh', display: 'flex', justifyContent: 'flex-end' }}>
            <Parallax translateY={[0, -100]}>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4em'
                }}
              >
                <Image
                  className='image-container'
                  src='/how_it_works_traveller_3.png'
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />

                <Typography variant='h5' align='center' color='#FDECEF'>
                  เติบโตไปกับชุมชนของนักเดินทาง
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  หาเพื่อน เจอคนใหม่ๆ สร้างความสัมพันธ์ในโลกของนักท่องเที่ยว
                </Typography>
              </div>
            </Parallax>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HowItWorksTraveller
