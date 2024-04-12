// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Config Imports
import themeConfig from 'src/configs/themeConfig'

const Button = (theme: Theme) => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 5,
          lineHeight: 1.71,
          letterSpacing: '0.3px',
          padding: `${theme.spacing(1.875, 3)}`
        },
        contained: {
          // boxShadow: theme.shadows[3],
          boxShadow: `5px 5px ${theme.palette.info.main}`, 
          padding: `${theme.spacing(1.875, 5.5)}`,
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: `3px 3px ${theme.palette.info.dark}`,
          },
          '&:active': { 
            boxShadow: `none`,
            transform: 'translateY(2px)' 
          },
          
        },
        outlined: {
          boxShadow: `5px 5px ${theme.palette.info.main}`, 
          padding: `${theme.spacing(1.625, 5.25)}`,
          '&:hover': {
            boxShadow: `3px 3px ${theme.palette.info.dark}`,
          },
          '&:active': { 
            boxShadow: `none`, 
            transform: 'translateY(2px)' 
          },
          
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(1, 3.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(0.75, 3.25)}`
          }
        },
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(2.125, 6.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.875, 6.25)}`
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: themeConfig.disableRipple
      }
    }
  }
}

export default Button
