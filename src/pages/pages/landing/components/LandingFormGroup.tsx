import * as React from 'react'

// import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import SearchIcon from '@mui/icons-material/Search'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
// import Slider from '@mui/material/Slider'

interface HeroFormProps {
  selectedDate: Date | null
  selectedPriceRange: [number, number]
  onDateChange: (newValue: Date | null) => void
  onPriceChange: (newPriceRange: [number, number]) => void
}

// NOTE: this component is not complete
export default function LandingFormGroup(props: HeroFormProps) {
  const keepProps = props // delete this keepProps condition when using this component
  if (keepProps) {
    return (
      <Container maxWidth='md' style={{ padding: "2.5em" }}>
        <Grid container spacing={2} alignItems='center' justifyContent='center' style={{ padding: "1em", backgroundColor: '#FDECEF', borderRadius: 20, marginTop: '2em', opacity: '0.95' }}>
          {/* <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Search Location'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
  
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label='Select Date'
                value={selectedDate} // State variable
                onChange={(newValue: any) => onDateChange(newValue)}
              />
            </LocalizationProvider>
          </Grid>
  
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={selectedPriceRange} // State variable
              onChange={() => onPriceChange([0, 0])} // State update
              min={0}
              max={1000}
              valueLabelDisplay='auto'
            />
          </Grid> */}
        </Grid>
      </Container>
    )
  } else {
    <></>
  }
}
