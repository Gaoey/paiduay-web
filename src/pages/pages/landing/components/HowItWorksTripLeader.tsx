import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Parallax } from 'react-scroll-parallax'

const HowItWorksTripLeader = () => {
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
    const imageContainers = document.querySelectorAll('.image-container') // Replace with the correct selector

    imageContainers.forEach(container => {
      gsap.to(container, {
        y: '-20', // Adjust for desired movement amount
        duration: 1.5,
        ease: 'ease-in-out',
        repeat: -1,
        yoyo: true,
        stagger: 0.2
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
        padding: '8em 0 4em 0'
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent='center'
        alignItems='center'
        style={{ height: '100%', maxWidth: '1500px', margin: '0 auto' }}
      >
        <Grid container ref={imageContainerRef} justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={12} style={{ height: '40vh' }}>
            <Parallax opacity={[0.5, 1]}>
              <Typography variant='h5' align='center' color='#FDECEF'>
                สำหรับ ทริปลีดเดอร์
              </Typography>
              <Typography paragraph align='center' color='#FDECEF'>
                เราเป็นผู้ช่วยให้คุณสร้างทริปได้ง่ายๆ
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '100vh', display: 'flex', justifyContent: 'flex-start' }}>
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
                  src='/images/landing/how_it_works/how_it_works_leader_1.png' // Path relative to '/public' folder
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />
                <Typography variant='h5' align='center' color='#FDECEF'>
                  สร้างทริปในไม่กี่ click
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  ลดเวลาพูดซ้ำๆ เก็บทุกข้อมูลไว้ที่เดียว
                </Typography>
              </div>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '80vh', display: 'flex', justifyContent: 'center' }}>
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
                  src='/images/landing/how_it_works/how_it_works_leader_2.png' // Path relative to '/public' folder
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />

                <Typography variant='h5' align='center' color='#FDECEF'>
                  จัดการทริปให้เต็มที่
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  ด้วยเครื่องมือจัดการจากเรา ทำให้การสื่อสารกับนักเดินทางและการจองเป็นเรื่องง่ายๆ
                </Typography>
              </div>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12} style={{ height: '80vh', display: 'flex', justifyContent: 'flex-end' }}>
            <Parallax translateY={[0, -200]}>
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
                  src='/images/landing/how_it_works/how_it_works_leader_3.png' // Path relative to '/public' folder
                  alt='จัดการทริปให้เต็มที่'
                  width={imageDimensions.width}
                  height={imageDimensions.width}
                />

                <Typography variant='h5' align='center' color='#FDECEF'>
                  เติบโตไปกับชุมชนของนักเดินทาง
                </Typography>
                <Typography paragraph align='center' color='#FDECEF'>
                  สร้างชื่อ เก็บรวบรวมคำชมและรีวิว connect กับชุมชนนักเดินทางของคุณ
                </Typography>
              </div>
            </Parallax>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HowItWorksTripLeader
