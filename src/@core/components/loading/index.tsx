import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import AlertWarning from './alert'
import * as R from 'ramda'

const FullScreenLoadingComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 2, md: 3 }
      }}
    >
      <CircularProgress size={40} color='primary' />
      <Typography variant='subtitle2' sx={{ mt: 1 }}>
        Loading
      </Typography>
    </Box>
  )
}

type BasicProps = {
  children: any
  isLoading: boolean
  error: Error | null | unknown | (any & { data: string })
  message?: string
}

export function BasicLoadingComponent(props: BasicProps) {
  const [error, setError] = React.useState<any | null>(null)
  const [open, setOpen] = React.useState<boolean>(false)
  const { children, isLoading, message = 'Something went wrong, please try again' } = props

  useEffect(() => {
    if (!R.isNil(props.error) && R.isNil(error)) {
      setError(props.error)
    }
  }, [props.error])

  useEffect(() => {
    if (!R.isNil(error) && !open) {
      setOpen(true)
    }
  }, [error, open])

  if (isLoading) {
    return <FullScreenLoadingComponent />
  }

  return (
    <>
      {error && (
        <AlertWarning
          open={open}
          onClose={() => {
            setOpen(false)
            setError(null)
          }}
          data={{ title: 'Warning', desciption: `${message}: ${error?.data}` }}
        />
      )}
      {children}
    </>
  )
}
