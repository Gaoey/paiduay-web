import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import LandingFormGroup from './LandingFormGroup'
import Main from './Main'

interface HeroFormProps {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
  onDateChange: (newValue: Date | null) => void
  onPriceChange: (newPriceRange: [number, number]) => void
}

function HeroSection({ selectedDate, selectedPriceRange, onDateChange, onPriceChange }: HeroFormProps) {
  const pathRef = useRef<any>(null)

  useEffect(() => {
    const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 10000

    gsap.set(pathRef.current, {
      // Initial styles for the path
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    })
    const timeline = gsap.timeline()

    timeline.to(pathRef.current, {
      duration: 4,
      strokeDashoffset: 0,
      ease: 'power2.out'
    })
  }, [])

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
            zIndex: '100'
          }}
        >
          <Typography variant='h4' align='center' color='#3B534A'>
            headache-free trip manager
          </Typography>
          <LandingFormGroup
            selectedDate={selectedDate}
            selectedPriceRange={selectedPriceRange}
            onDateChange={onDateChange}
            onPriceChange={onPriceChange}
          />
        </div>
        <Main />
        {/* <div
          style={{
            // position: 'absolute',
            // bottom: '1em',
            margin: '0',
            height: 'auto',
            width: '100vw',
            display: 'flex',
            zIndex: '10'
          }}
        >
          <svg id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 940.23 351.95' style={{ width: '100%' }}>
            <path
              className='cls-1'
              style={{
                fill: 'none',
                stroke: '#feedef',
                strokeLinecap: 'round',
                strokeMiterlimit: '10',
                strokeWidth: '7px',
                width: '100%'
              }}
              ref={pathRef}
              d='M-.25,316.78c74.54-51.39,103.91,18.64,158.12,20.33s-13.55-126.49,63.25-161.51,102.78,94.31,157.55,101.08,56.6-90.97,56.6-90.97c0,0,2.32-22.46-2.32-60.4-4.65-37.95,6.97-54.21,27.1-53.43,20.13.77,3.96,57.28,17.27,58.14,6.37.41,1.92-26.71,8.89-36,6.97-9.29,21.81-10.6,19.48,11.86-2.32,22.46-1.26,30.63,3.39,27.53,4.65-3.1,4.82-22.69,9.32-27.95,5.01-5.86,13-6.68,16.09,3.39,3.1,10.07-5.52,31.19-.88,30.41s7.74-21.68,11.62-24.78c3.87-3.1,9.29-4.65,10.84,4.65s-6.97,24.78-3.87,25.56,6.78-17.2,13.92-17.48c14.68-.56,6.43,35.77,5.22,42.64-1.27,7.2-2.12,12.71-14.49,43.76,0,0-40.4,88.5,19.46,56.31S705.06,46.85,763.79,23.14s70.02,9.04,107.86,20.33,68.33,12.99,68.33,12.99'
            />
          </svg>
        </div> */}
      
      </div>

  )
}

export default HeroSection
