import AlternateEmail from '@mui/icons-material/AlternateEmail'
import Groups from '@mui/icons-material/Groups'
import Schedule from '@mui/icons-material/Schedule'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import format from 'date-fns/format'
import parse from 'html-react-parser'
import * as R from 'ramda'
import { Trip, TripMember } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'
import { DefaultCoverTripImage } from '../admin/TripDetail'
import TourIcon from '@mui/icons-material/Tour'
import { Theme, useTheme } from '@mui/material/styles'
import trimHtml from 'src/@core/utils/trimHtml'
import styled from '@emotion/styled'

interface TripCardProps {
  trip: Trip
  hideProfiler?: boolean
}
export default function TripCard(props: TripCardProps) {
  const { trip, hideProfiler = false } = props
  const theme: Theme = useTheme()

  const imgSrc: string[] = R.isEmpty(trip?.data.cover_images)
    ? [DefaultCoverTripImage]
    : trip?.data.cover_images.map(v => v.signed_url)

  // ** Hook
  const htmlString = trimHtml(trip?.data?.description || '', 80)
  const parsedHtml = parse(htmlString)

  const profiler = trip?.profiler

  // AVATAR
  const profilerAvatar = !R.isNil(profiler?.data?.logo_image?.signed_url) ? (
    <Avatar src={profiler?.data?.logo_image?.signed_url || ''} />
  ) : (
    <Avatar>{profiler?.data?.name[0]}</Avatar>
  )

  // MEMBER AVATAR
  const goingAvatars = <GoingAvatars members={trip?.data?.members ?? []} />

  return (
    <Card
      sx={{
        height: {
          xs: '350px', // Small screens
          sm: '400px', // Medium screens
          md: '400px', // Large screens
          lg: '500px' // Extra-large screens
        }
      }}
    >
      {!hideProfiler && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '1em',
            backgroundColor: theme.palette.secondary.light,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1em'
          }}
        >
          <Link
            href={`/profiler/${trip?.profiler_id}`}
            sx={{
              '&:hover': {
                color: '#000000',
                textDecoration: 'underline #000000'
              },
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Box>
              <div>{profilerAvatar}</div>
              <Typography variant='body1' color='text.primary' style={{ paddingLeft: '1em', fontWeight: 'bold' }}>
                {profiler?.data?.name || 'Trip Leader'}
              </Typography>
            </Box>
          </Link>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5em',
              flexShrink: 0
            }}
          >
            <TourIcon style={{ color: theme.palette.secondary.main, height: '100%' }} />
            <Typography
              variant='body2'
              color={theme.palette.secondary.main}
              style={{ paddingLeft: '0.5em', fontWeight: 'bold' }}
            >
              ทริปลีดเดอร์
            </Typography>
          </div>
        </div>
      )}
      <Link href={`/trips/${trip._id}`}>
        <>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography gutterBottom variant='h6' sx={{ fontWeight: 'bold' }}>
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
              </Grid>

              <Grid item xs={8} sm={8}>
                <div style={{ display: 'flex', paddingBottom: '0.6em', alignItems: 'center' }}>
                  <Schedule style={{ color: theme.palette.secondary.main }} />
                  <Typography
                    variant='body2'
                    color={theme.palette.secondary.main}
                    style={{ paddingLeft: '0.5em', fontWeight: 'bold' }}
                  >
                    {`${format(new Date(trip?.data.from_date), 'dd MMM yyyy')} -
                ${format(new Date(trip?.data.to_date), 'dd MMM yyyy')}`}
                  </Typography>
                </div>
                <div style={{ display: 'flex', paddingBottom: '0.6em', alignItems: 'center' }}>
                  <Groups style={{ color: theme.palette.error.main }} />
                  <Typography variant='body2' color={theme.palette.error.main} style={{ paddingLeft: '0.5em' }}>
                    ไปด้วย: {trip?.data?.members.length} / {trip?.data?.total_people} คน
                  </Typography>
                </div>
                <div>{goingAvatars}</div>
                {hideProfiler &&
                  trip?.data?.contacts.map((v, id) => {
                    return (
                      <div style={{ display: 'flex' }} key={id}>
                        <AlternateEmail style={{ color: '#3B5249' }} />
                        <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                          {v.contact_type}
                        </Typography>
                        <Link href={v.link} rel='noopener noreferrer'>
                          <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                            {trimMessage(v.link, 50)}
                          </Typography>
                        </Link>
                      </div>
                    )
                  })}

                <div style={{ marginTop: 10 }}>{parsedHtml}</div>
              </Grid>
              <Grid item xs={4} sm={4}>
                <CardMedia
                  component='img'
                  image={imgSrc[0]}
                  alt='image of trip'
                  sx={{
                    width: '100%', // Scale responsively to the grid
                    aspectRatio: '1 / 1', // Maintain the aspect ratio (4:3 in this case)
                    borderRadius: '12px',
                    mt: 1,
                    objectFit: 'cover'
                  }}
                />{' '}
              </Grid>
            </Grid>
          </CardContent>
        </>
      </Link>
    </Card>
  )
}

const AvatarWrapper = styled(Box)`
  display: flex;
  align-items: center;
`

const StackedAvatar = styled(Avatar)<{ index: number }>`
  z-index: ${({ index }) => 100 - index};
  margin-left: ${({ index }) => (index > 0 ? '-0.5em' : '0')}; // Adjust stacking overlap
  border: 2px solid white;
  height: 1.2em;
  width: 1.2em;
`

interface GoingAvatarsProps {
  members: TripMember[]
}

const GoingAvatars: React.FC<GoingAvatarsProps> = ({ members }: GoingAvatarsProps) => {
  const MAX_VISIBLE_AVATARS = 3
  const extraCount = members.length - MAX_VISIBLE_AVATARS
  const visibleMembers = extraCount > 0 ? members.slice(0, MAX_VISIBLE_AVATARS) : members

  return (
    <AvatarWrapper>
      {visibleMembers.map((member, index) => (
        <StackedAvatar key={index} src={member?.user_data?.profile_image || ''} index={index}>
          {!member?.user_data?.profile_image ? member?.user_data?.name?.[0] : ''}
        </StackedAvatar>
      ))}
      {extraCount > 0 && (
        <Typography variant='body2' style={{ fontSize: '0.7em', paddingLeft: '0.1em' }}>{`+${extraCount}`}</Typography>
      )}
    </AvatarWrapper>
  )
}
