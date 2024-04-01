import Box from '@mui/material/Box'
import Image from 'next/image'
import Contact from './components/Contact'

const PageSevenDesktop = () => {

  return (
    <div>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          padding: {
            xs: '8.5vw 1vw',
            md: '7vw 1vw',
            lg: '6vw 1vw'
          },
          backgroundColor: '#282826'
        }}
      >
        <Image src='/images/log21/full_logo.svg' layout='fill' alt='full-logo' objectFit='contain' priority />
      </Box>
      <Contact />
    </div>
  )
}

export default PageSevenDesktop
