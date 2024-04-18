import AlternateEmail from '@mui/icons-material/AlternateEmail'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import CloseFullscreen from '@mui/icons-material/CloseFullscreen'
import Fullscreen from '@mui/icons-material/Fullscreen'
import Groups from '@mui/icons-material/Groups'
import Schedule from '@mui/icons-material/Schedule'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography
} from '@mui/material'

import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

import { format } from 'date-fns'
import parse from 'html-react-parser'
import * as R from 'ramda'
import { useEffect } from 'react'
import { useApi } from 'src/@core/services'
import { Trip } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'

export const DefaultCoverTripImage =
  'https://img.freepik.com/free-vector/gradient-spring-illustration_23-2149264032.jpg?w=1380&t=st=1710694509~exp=1710695109~hmac=99468e4d3221b7e0b1890066b623b4fc51c382dc7a2f0c68bbdd92ad88a0cc42'

interface TripDetailsProps {
  tripID: string
  isShortDescription?: boolean
}

export default function TripDetailComponent({ tripID, isShortDescription = false }: TripDetailsProps) {
  const { tripAPI } = useApi()

  const { findTripByID } = tripAPI
  const { data } = findTripByID

  useEffect(() => {
    findTripByID.mutate(tripID)
  }, [])

  const trip = data as Trip | undefined
  const profiler = trip?.profiler

  if (R.isNil(trip) || R.isNil(profiler)) {
    return <CircularProgress color='secondary' />
  }

  const imgSrc: string[] = R.isEmpty(trip?.data.cover_images)
    ? [DefaultCoverTripImage]
    : trip?.data.cover_images.map(v => v.signed_url)

  const images = imgSrc.map(v => ({ original: v, thumbnail: v, thumbnailHeight: '60px', originalHeight: '600px' }))
  const htmlString = trip?.data?.description
  const msg = trimMessage(htmlString, 300)
  const parsedHtml = parse(isShortDescription ? msg : htmlString)

  const DescriptionHTML = () => {
    return <>{parsedHtml}</>
  }

  return (
    <Card style={{ margin: 0, maxWidth: 1200 }}>
      <CardHeader
        avatar={
          R.isNil(profiler?.data?.logo_image?.signed_url) ? (
            <Avatar src={profiler?.data?.logo_image?.signed_url || ''} />
          ) : (
            <Avatar>{profiler?.data?.name[0]}</Avatar>
          )
        }
        title={profiler?.data?.name}
      />

      {imgSrc.length === 1 ? (
        <CardMedia component='img' image={imgSrc[0]} alt='image of trip' sx={{ maxHeight: 500 }} />
      ) : (
        <ImageGallery
          items={images}
          showPlayButton={false}
          autoPlay={true}
          renderLeftNav={(onClick: any, disabled: boolean) => (
            <div style={{ position: 'absolute', top: '48%', left: '0.5em', zIndex: '1' }}>
              <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick} disabled={disabled}>
                <ChevronLeft />
              </IconButton>
            </div>
          )}
          renderRightNav={(onClick: any, disabled: boolean) => (
            <div style={{ position: 'absolute', top: '48%', right: '0.5em', zIndex: '1' }}>
              <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick} disabled={disabled}>
                <ChevronRight />
              </IconButton>
            </div>
          )}
          renderFullscreenButton={(onClick: any, isFullscreen: boolean) => (
            <div style={{ position: 'absolute', bottom: '1em', right: '1em', zIndex: '1' }}>
              <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick}>
                {isFullscreen ? <CloseFullscreen /> : <Fullscreen />}
              </IconButton>
            </div>
          )}
        />
      )}
      <CardContent>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography gutterBottom variant='h5' component='div'>
                {trip?.data?.title}
              </Typography>
              <Chip
                label={toCurrency(trip.data.payment?.full_price || 0.0)}
                color='primary'
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { fontWeight: 500 }
                }}
              />
            </Box>
            <div style={{ display: 'flex' }}>
              <Schedule style={{ color: '#3B5249' }} />
              <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                {`${format(new Date(trip?.data.from_date), 'dd MMM yyyy')} -
                ${format(new Date(trip?.data.to_date), 'dd MMM yyyy')}`}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Groups style={{ color: '#3B5249' }} />
              <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                จำนวนคน: {trip?.data?.members.length} / {trip?.data?.total_people}
              </Typography>
            </div>
            {trip?.data?.contacts.map((v, id) => {
              return (
                <div style={{ display: 'flex' }} key={id}>
                  <AlternateEmail style={{ color: '#3B5249' }} />
                  <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                    {v.contact_type}
                  </Typography>
                  <a href={`https://line.me/R/ti/g/OVvKBVRdhk`} rel='noopener noreferrer' target='_blank'>
                    <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                      {v.link}
                    </Typography>
                  </a>
                </div>
              )
            })}

            {/* <Typography variant='body2' color='text.secondary' style={{ marginTop: 10 }}>
              {trimMessage(trip?.data?.description, 1000)}
            </Typography> */}
            <div style={{ marginTop: 10 }}>
              <DescriptionHTML />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
