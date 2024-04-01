import React from 'react'
import { Parallax } from 'react-scroll-parallax'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

const HowItWorksTraveller = () => {
  return (
    <Container style={{ overflow: 'hidden', width: '100vw', height: '100vh', alignItems: 'center' }}>
      <Grid container spacing={4} justifyContent='center' alignItems='center' style={{ height: '100%' }}>
        <Grid container style={{ height: '100vh' }} justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={12}>
            <Parallax opacity={[0.5, 1]}>
              <Typography variant='h5' align='center'>
                สำหรับ ทริปลีดเดอร์
              </Typography>
              <Typography paragraph align='center'>
                เป็นผู้นำทริป เราเป็นผู้ช่วยให้คุณสร้างทริปได้ง่ายๆ
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-50, 100]}>
              <Typography variant='h5' align='center'>
                สร้างทริปในไม่กี่ click
              </Typography>
              <Typography paragraph align='center'>
                ลดเวลาพูดซ้ำๆ เก็บทุกข้อมูลไว้ที่เดียว
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-100, 100]}>
              <Typography variant='h5' align='center'>
                จัดการทริปให้เต็มที่
              </Typography>
              <Typography paragraph align='center'>
                ด้วยเครื่องมือจัดการจากเรา ทำให้การสื่อสารกับนักเดินทางและการจองเป็นเรื่องง่ายๆ
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-150, 100]}>
              <Typography variant='h5' align='center'>
                เติบโตไปกับชุมชนของนักเดินทาง
              </Typography>
              <Typography paragraph align='center'>
                สร้างชื่อให้ตัวเองในฐานะผู้นำทริปแห่งชุมชน เก็บรวบรวมคำชมและรีวิว, และเชื่อมต่อกับนักเดินทางที่พร้อมจะออกเดินทางครั้งใหม่ไปกับคุณ
              </Typography>
            </Parallax>
          </Grid>
        </Grid>
        <Grid container style={{ height: '100vh' }} justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={12}>
            <Parallax opacity={[0.5, 1]}>
              <Typography variant='h5' align='center'>
                สำหรับ ลูกทริป
              </Typography>
              <Typography paragraph align='center'>
                เตรียมพร้อมไปกัยการผจญภัยครั้งใหม่
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-50, 100]}>
              <Typography variant='h5' align='center'>
                จองทริป ไม่ยากอย่างที่คิด
              </Typography>
              <Typography paragraph align='center'>
                เหนื่อยไหมจองผ่านไลน์? ลืมนู้น ลืมนี่ สื่อสารผิดพลาด เรามาช่วยทำให้ทุอย่างง่ายขึ้น
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-100, 100]}>
              <Typography variant='h5' align='center'>
                จัดการทุกอย่างได้ในที่เดียว
              </Typography>
              <Typography paragraph align='center'>
                ทุกอย่างที่คุณต้องการจัดการ เรามีให้ครบในแดชบอร์ดแสนสะดวกของเรา - ทั้งตารางเวลา, ที่พัก, หรือวิธีการเดินทาง. เรียกได้ว่ามีทุกอย่างที่นิ้วคุณต้องการ!
              </Typography>
            </Parallax>
          </Grid>
          <Grid item xs={12} md={12}>
            <Parallax translateX={[-150, 100]}>
              <Typography variant='h5' align='center'>
                เปิดโลกกว้าง คอมมูนิตี้ นักท่องเที่ยว!
              </Typography>
              <Typography paragraph align='center'>
                พบปะสังสรรค์กับเพื่อนๆ นักเดินทางในชุมชนของเรา สร้างโปรไฟล์ ค้นพบเพื่อนใหม่ๆ ในที่ใหม่ๆ และตัวตนของคุยเอง!
              </Typography>
            </Parallax>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HowItWorksTraveller
