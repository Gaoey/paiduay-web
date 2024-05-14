import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import IconButton from '@mui/material/IconButton'

type props = {
  text: string
  style?: any
}

const TextBody = ({ text, style }: props) => {
  return (
    <Typography
      component={motion.div}
      whileHover={{ scale: 1.3 }}
      sx={{
        fontSize: {
          xs: '16px',
          md: '18px',
        },
        fontWeight: 500,
        lineHeight: {
          xs: '20px',
          md: '24px',
        },
        color: '#FFFFFF',
        ...style,
      }}
    >
      {text}
    </Typography>
  )
}

const Contact = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: {
            xs: '20px',
            md: '24px',
          },
          lineHeight: {
            sx: '24px',
            md: '30px',
          },
          color: '#FFFFFF',
        }}
      >
        Contact
      </Typography>
      <TextBody
        style={{ marginTop: '24px', textAlign: 'center' }}
        text='76 ซอยสุขุมวิท 101/2 แขวงบางนาเหนือ เขตบางนา กรุงเทพฯ 10260'
      />
      <TextBody
        style={{ marginTop: '16px' }}
        text='chaiyaporn.chi@log21ruby.com'
      />
      <TextBody style={{ marginTop: '16px' }} text='0892036581' />
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '22px' }}>
        <IconButton
          href='https://www.linkedin.com/company/72361230'
          target='_blank'
          rel='noreferrer noopener this link opens to a linkedin'
        >
          <Image
            src='/images/icons/linkedin.svg'
            width={32}
            height={32}
            alt='linkedin-icon'
          />
        </IconButton>
        <IconButton>
          <Image
            src='/images/icons/line.svg'
            width={32}
            height={32}
            alt='line-icon'
          />
        </IconButton>
        <IconButton>
          <Image
            src='/images/icons/fb.svg'
            width={32}
            height={32}
            alt='line-icon'
          />
        </IconButton>
      </Box>
    </div>
  )
}

export default Contact
