import * as React from 'react'
import HeroSection from './components/HeroSection'
import HowItWorksTraveller from './components/HowItWorksTraveller' // Assuming that's your path

interface LandingPageState {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
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
    <div>
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

      {/* (5) How it works: traveller */}
      <HowItWorksTraveller />

      {/* (5) How it works: trip leader */}
      <HowItWorksTraveller />

      {/* (6) Footer */}
      <footer> ... </footer>
    </div>
  )
}

export default LandingPage
