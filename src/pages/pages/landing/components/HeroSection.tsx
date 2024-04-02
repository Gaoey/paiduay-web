import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LandingFormGroup from './LandingFormGroup'
import Main from './Main'

interface HeroFormProps {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
  onDateChange: (newValue: Date | null) => void
  onPriceChange: (newPriceRange: [number, number]) => void
}

function HeroSection({ selectedDate, selectedPriceRange, onDateChange, onPriceChange }: HeroFormProps) {

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
        <div style={{ paddingTop: '4em'}}>
         <Button variant="contained" color="secondary">ดู ทริป</Button>
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
