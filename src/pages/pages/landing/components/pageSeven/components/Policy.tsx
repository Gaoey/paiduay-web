import { motion, useViewportScroll, useTransform } from 'framer-motion'
import Typography from '@mui/material/Typography'
import { POLICY_SLIDE } from '../../../../../../configs/animationConfig'

const Policy = () => {
  const { scrollYProgress } = useViewportScroll()

  const yPos = useTransform(scrollYProgress, POLICY_SLIDE, [100, 0])
  const opacity = useTransform(scrollYProgress, POLICY_SLIDE, [0, 1])

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        y: yPos,
        opacity,
      }}
    >
      <Typography
        textAlign='right'
        sx={{
          fontWeight: 600,
          fontSize: {
            xs: '20px',
            md: '24px',
          },
          lineHeight: {
            sx: '24px',
            md: '30px',
          },
          color: '#ADF802',
          fontStyle: 'italic',
        }}
      >
        Privacy Policy
      </Typography>
      <Typography
        textAlign='right'
        sx={{
          fontWeight: 600,
          fontSize: {
            xs: '20px',
            md: '24px',
          },
          lineHeight: {
            sx: '24px',
            md: '30px',
          },
          color: '#ADF802',
          fontStyle: 'italic',
          marginTop: {
            xs: '12px',
            md: '20px',
          },
        }}
      >
        Terms & Conditions
      </Typography>
    </motion.div>
  )
}

export default Policy
