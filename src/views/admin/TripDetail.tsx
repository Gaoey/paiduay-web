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
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import * as R from 'ramda'
import { useEffect } from 'react'
import { useApi } from 'src/@core/services'
import { ProfilerData } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'

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

  const imgSrc = R.isEmpty(trip?.data.cover_images)
    ? 'https://img.freepik.com/free-vector/gradient-spring-illustration_23-2149264032.jpg?w=1380&t=st=1710694509~exp=1710695109~hmac=99468e4d3221b7e0b1890066b623b4fc51c382dc7a2f0c68bbdd92ad88a0cc42'
    : trip?.data.cover_images[0].signed_url

  return (
    <Card>
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
      <CardMedia component='img' image={imgSrc} alt='image of trip' sx={{ maxHeight: 500 }} />
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
            <Typography variant='body2' color='text.secondary'>
              Date: ({format(new Date(trip?.data.from_date), 'dd MMM yyyy')} -
              {format(new Date(trip?.data.to_date), 'dd MMM yyyy')})
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              จำนวนคน: {trip?.data?.members.length} / {trip?.data?.total_people}
            </Typography>
            <Typography variant='body2' color='text.secondary' style={{ marginTop: 10 }}>
              {trimMessage(trip?.data?.description, 1000)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
