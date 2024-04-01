import * as React from 'react'
import Head from 'next/head'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Link from 'next/link'
import HeroSection from './components/HeroSection'
import HowItWorksTraveller from './components/HowItWorksTraveller'; // Assuming that's your path

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
      <Head>
        <title>Headache-Free Trip Manager</title>
        {/* Add meta tags for description, SEO, etc. */}
      </Head>

      {/* (1) Top Menu Bar */}
      <AppBar position='static'>
        <div style={{ backgroundColor: "#3B534A", width: '100vw', padding: '0 2em 0 2em', overflow: 'hidden' }}>
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              <Link href='/'>
                <a>ท.TRIP</a>
              </Link>
            </Typography>
            {/* Navigation Links */}
            <nav>
              <Link href='/trip-leader' passHref>
                <Button color='inherit'>Trip Leader</Button>
              </Link>
              {/* Add more buttons similarly for: how it works, about, contact  */}
            </nav>
            {/* Login Button (Right Aligned) */}
            <Button color='inherit' sx={{ ml: 'auto' }}>
              Login
            </Button>
          </Toolbar>
        </div>
      </AppBar>

      {/* (2) Hero Section */}
      <section style={{ backgroundColor: '#3B534A', backgroundSize: 'cover', overflow: 'hidden', position: 'relative' }}>
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
