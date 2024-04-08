import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Main from './Main'

interface HeroFormProps {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
  onDateChange: (newValue: Date | null) => void
  onPriceChange: (newPriceRange: [number, number]) => void
}

function HeroSection(_props: HeroFormProps) {
  const router = useRouter()

  return (
    <div style={{ width: '100vw', position: 'relative', overflowY: 'hidden', zIndex: '10' }}>
      {/* Limit container for focused content */}
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
            ดู ทริป
          </Button>
        </div>

        {/* <LandingFormGroup
          selectedDate={selectedDate}
          selectedPriceRange={selectedPriceRange}
          onDateChange={onDateChange}
          onPriceChange={onPriceChange}
        /> */}
      </div>
      <Main />
    </div>
  )
}

export default HeroSection
