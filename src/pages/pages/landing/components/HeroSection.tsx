import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Main from './Main'

function HeroSection() {
  const router = useRouter()

  return (
    <div style={{ 
      width: '100vw', 
      position: 'relative', 
      overflow: 'hidden', 
      zIndex: '10' 
    }}>
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
        <Typography variant='h4' align='center' color='#3B534A'>
          เราคือเพื่อน ที่จะช่วยคุณจัดการทริป
        </Typography>
        <div style={{ paddingTop: '4em' }}>
          <Button variant='contained' color='secondary' onClick={() => router.push('/trips')}>
            Get Started!
          </Button>
        </div>
      </div>
      <Main />
    </div>
  )
}

export default HeroSection
