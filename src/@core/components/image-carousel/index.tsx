import 'react-multi-carousel/lib/styles.css'
import { Media } from 'src/@core/types'

import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

interface Props {
  medias: Media[]
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: '100%',
  height: 500,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
  alignSelf: 'center'
}))

export default function ImageCarousel(props: Props) {
  const { medias } = props

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box>
        {medias.map(m => (
          <ImgStyled src={m.signed_url} key={m.signed_url} />
        ))}
      </Box>
    </Box>
  )
}
