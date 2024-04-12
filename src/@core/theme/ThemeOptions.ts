// ** MUI Theme Provider
import { deepmerge } from '@mui/utils'
import { ThemeOptions } from '@mui/material'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import breakpoints from './breakpoints'
// import { Itim } from 'next/font/google'

const themeOptions = (settings: Settings): ThemeOptions => {
  // ** Vars
  const { mode, themeColor } = settings

  const themeConfig = {
    palette: palette(mode, themeColor),
    typography: {
      fontFamily: [
        'Noto Sans Thai looped',
        'Inter',
        'sans-serif',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(',')
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6
    },
    mixins: {
      toolbar: {
        minHeight: 64
      }
    }
  }

  return deepmerge(themeConfig, {
    palette: {
      primary: {
        main: '#3B5249'
      },
      secondary: {
        main: '#A71D31'
      },
      background: {
        default: '#FDECEF',
        paper: '#FAFAFA'
      },
      info: {
        light: '#C4E3EA',
        main: '#74B3CE',
        dark: '#74839E'
      },
      error: {
        main: '#FB8B24'
      }
    }
  })
}

export default themeOptions
