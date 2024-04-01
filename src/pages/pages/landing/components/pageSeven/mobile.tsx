import Box from '@mui/material/Box'
import Image from 'next/image'
import Contact from './components/Contact'

const PageSevenMobile = () => {

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
          padding: '14vw 1.5vw',
          backgroundColor: '#282826',
        }}
      >
          <Box
            sx={{
              width: {
                xs: '30vw',
                sm: '22vw',
              },
              maxWidth: '185px',
              height: {
                xs: '22.8vw',
                sm: '15.2vw',
              },
              maxHeight: '141px',
              position: 'relative',
            }}
          >
            <Image
              src='/images/log21/full_logo.svg'
              layout='fill'
              alt='full-logo'
              objectFit='contain'
              priority
            />
          </Box>
        <Contact />
        {/* <Policy /> */}
        </Box>
        </div>
  )
}

export default PageSevenMobile
