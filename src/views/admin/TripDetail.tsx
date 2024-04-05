import Groups from '@mui/icons-material/Groups'
import Schedule from '@mui/icons-material/Schedule'
import AlternateEmail from '@mui/icons-material/AlternateEmail'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Fullscreen from '@mui/icons-material/Fullscreen'
import CloseFullscreen from '@mui/icons-material/CloseFullscreen'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography
} from '@mui/material'

import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

import { format } from 'date-fns'
import * as R from 'ramda'
import { useEffect } from 'react'
import { useApi } from 'src/@core/services'
import { ProfilerData } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'
import Link from 'next/link'

interface TripDetailsProps {
  tripID: string
}

export default function TripDetailComponent({ tripID }: TripDetailsProps) {
  const { tripAPI, profilerAPI } = useApi()

  const { findTripByID } = tripAPI
  const { getCurrentProfilerMutation } = profilerAPI

  const { data: profilerData } = getCurrentProfilerMutation
  const { data } = findTripByID

  useEffect(() => {
    findTripByID.mutate(tripID)
    getCurrentProfilerMutation.mutate()
  }, [])

  const profiler = R.pathOr<ProfilerData | null>(null, ['0', 'data'], profilerData)
  const trip = data as Trip | undefined

  if (R.isNil(trip) || R.isNil(profiler)) {
    return <CircularProgress color='secondary' />
  }

  const imgSrc: string[] = R.isEmpty(trip?.data.cover_images)
    ? [
        'https://img.freepik.com/free-vector/gradient-spring-illustration_23-2149264032.jpg?w=1380&t=st=1710694509~exp=1710695109~hmac=99468e4d3221b7e0b1890066b623b4fc51c382dc7a2f0c68bbdd92ad88a0cc42'
      ]
    : trip?.data.cover_images.map(v => v.signed_url)

  const images = imgSrc.map(v => ({ original: v, thumbnail: v, thumbnailHeight: '60px', originalHeight: '600px' }))

  return (
    <Card style={{ margin: 0, maxWidth: 1200 }}>
      <CardHeader
        avatar={
          R.isNil(profiler?.logo_image?.signed_url) ? (
            <Avatar src={profiler?.logo_image?.signed_url || ''} />
          ) : (
            <Avatar>{profiler?.name[0]}</Avatar>
          )
        }
        title={profiler?.name}
        subheader={() => {
          ;<></>
        }}
      />

      <ImageGallery
        items={images}
        showPlayButton={false}
        autoPlay={true}
        renderLeftNav={(onClick: any, disabled: boolean) => (
          <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick} disabled={disabled}>
            <ChevronLeft />
          </IconButton>
        )}
        renderRightNav={(onClick: any, disabled: boolean) => (
          <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick} disabled={disabled}>
            <ChevronRight />
          </IconButton>
        )}
        renderFullscreenButton={(onClick: any, isFullscreen: boolean) => (
          <div style={{ position: 'absolute', bottom: '1em', right: '1em' }}>
            <IconButton color='secondary' aria-label='go back' component='span' onClick={onClick}>
              {isFullscreen ? <CloseFullscreen /> : <Fullscreen />}
            </IconButton>
          </div>
        )}
      />

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
                  <a href={`//${v.link}`} rel='noopener noreferrer' target='_blank'>
                    <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                      {v.link}
                    </Typography>
                  </a>
                </div>
              )
            })}

            <Typography variant='body2' color='text.secondary' style={{ marginTop: 10 }}>
              {trimMessage(trip?.data?.description, 1000)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
