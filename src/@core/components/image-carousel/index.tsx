import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Media } from 'src/@core/types'

import { styled } from '@mui/material/styles'

interface Props {
  medias: Media[]
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 400,
  height: 500,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

export default function ImageCarousel(props: Props) {
  const { medias } = props

  return (
    <Carousel responsive={responsive}>
      {medias.map(m => (
        <ImgStyled src={m.signed_url} key={m.signed_url} />
      ))}
    </Carousel>
  )
}
