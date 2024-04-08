import { AlternateEmail, Groups, Schedule } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Chip, Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import * as R from 'ramda'
import { Trip } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'
import { DefaultCoverTripImage } from '../admin/TripDetail'
import { LinkStyled } from 'src/pages/pages/register'
import Link from 'next/link'

interface TripCardProps {
  trip: Trip
}
export default function TripCard(props: TripCardProps) {
  const { trip } = props

  const imgSrc: string[] = R.isEmpty(trip?.data.cover_images)
    ? [DefaultCoverTripImage]
    : trip?.data.cover_images.map(v => v.signed_url)

  // ** Hook

  return (
    <Card sx={{ minHeight: 600 }}>
      <CardHeader
        avatar={
          R.isNil(trip?.profiler?.data?.logo_image?.signed_url) ? (
            <Avatar src={trip?.profiler?.data?.logo_image?.signed_url || ''} />
          ) : (
            <Avatar>{trip?.profiler?.data?.name[0]}</Avatar>
          )
        }
        title={trip?.profiler?.data?.name}
      />

      <CardMedia component='img' image={imgSrc[0]} alt='image of trip' sx={{ maxHeight: 300 }} />
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
                  <a href={v.link} rel='noopener noreferrer' target='_blank'>
                    <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                      {trimMessage(v.link, 50)}
                    </Typography>
                  </a>
                </div>
              )
            })}

            <Typography variant='body2' color='text.secondary' style={{ marginTop: 10 }}>
              {trimMessage(trip?.data?.description, 200)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
