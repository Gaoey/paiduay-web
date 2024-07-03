import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Main from './Main'

function HeroSection() {
  const router = useRouter()

  return (
    <div
      style={{
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        zIndex: '10'
      }}
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          width: '100vw',
          height: '50%',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: '100'
        }}
      >
        {/* color='#3B534A' */}
        <Typography variant='h3' align='center' color='#020F12' sx={{ marginTop: '3em' }}>
          เราคือเพื่อน
        </Typography>
        <Typography variant='h3' align='center' color='#020F12' sx={{ marginTop: '0.5em' }}>
          ที่ทำให้คุณไปเที่ยวได้ง่ายขึ้น
        </Typography>
        <div style={{ paddingTop: '4em' }}>
          <Button variant='contained' color='secondary' onClick={() => router.push('/trips')}>
            ไปด้วยกันเลย!
          </Button>
        </div>
      </div>
      <Main />
    </div>
  )
}

export default HeroSection
