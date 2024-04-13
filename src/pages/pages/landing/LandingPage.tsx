import React, { useEffect, useState, useRef } from 'react'
import HeroSection from './components/HeroSection'
import HowItWorksTripLeader from './components/HowItWorksTripLeader' // Assuming that's your path
import HowItWorksTraveller from './components/HowItWorksTraveller'
import Footer from './components/pageSeven/index'

interface LandingPageState {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
}

const PathBackground = () => {
  const pathRef = useRef<any>(null)

  const [scrollProgress, setScrollProgress] = useState(0)

  const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 10000
  useEffect(() => {
    const updateScrollProgress = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = winScroll / height
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', updateScrollProgress)
    
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1em',
        margin: '0',
        height: 'auto',
        width: '100vw',
        display: 'flex'
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
            width: '100%',
            opacity: '0.1'
          }}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - scrollProgress * pathLength}
          ref={pathRef}
          d='M-.25,316.78c74.54-51.39,103.91,18.64,158.12,20.33s-13.55-126.49,63.25-161.51,102.78,94.31,157.55,101.08,56.6-90.97,56.6-90.97c0,0,2.32-22.46-2.32-60.4-4.65-37.95,6.97-54.21,27.1-53.43,20.13.77,3.96,57.28,17.27,58.14,6.37.41,1.92-26.71,8.89-36,6.97-9.29,21.81-10.6,19.48,11.86-2.32,22.46-1.26,30.63,3.39,27.53,4.65-3.1,4.82-22.69,9.32-27.95,5.01-5.86,13-6.68,16.09,3.39,3.1,10.07-5.52,31.19-.88,30.41s7.74-21.68,11.62-24.78c3.87-3.1,9.29-4.65,10.84,4.65s-6.97,24.78-3.87,25.56,6.78-17.2,13.92-17.48c14.68-.56,6.43,35.77,5.22,42.64-1.27,7.2-2.12,12.71-14.49,43.76,0,0-40.4,88.5,19.46,56.31S705.06,46.85,763.79,23.14s70.02,9.04,107.86,20.33,68.33,12.99,68.33,12.99'
        />
      </svg>
    </div>
  )
}

function LandingPage() {
  const [state, setState] = React.useState<LandingPageState>({
    selectedDate: null,
    selectedPriceRange: [0, 100000]
  })

  const handleDateChange = (newValue: Date | null) => {
    setState({ ...state, selectedDate: newValue })
  }

  const setPriceRange = (priceRange: [number, number]) => {
    setState({ ...state, selectedPriceRange: priceRange })
  }

  return (
    <div
      style={{
        backgroundColor: '#3B534A',
        overflow: 'hidden'
      }}
    >

      {/* (2) Hero Section */}
      <section
        style={{ backgroundColor: '#3B534A', backgroundSize: 'cover', overflow: 'hidden', position: 'relative' }}
      >
        <HeroSection
          selectedDate={state.selectedDate}
          selectedPriceRange={state.selectedPriceRange}
          onDateChange={handleDateChange}
          onPriceChange={setPriceRange}
        />
      </section>

      <PathBackground />

      {/* (5) How it works: traveller */}
      <HowItWorksTripLeader />

      {/* (5) How it works: trip leader */}
      <HowItWorksTraveller />

      {/* (6) Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
