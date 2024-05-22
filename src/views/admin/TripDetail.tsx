import AlternateEmail from '@mui/icons-material/AlternateEmail'
import Groups from '@mui/icons-material/Groups'
import Schedule from '@mui/icons-material/Schedule'
import TourIcon from '@mui/icons-material/Tour'
import { Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { Theme, useTheme } from '@mui/material/styles'
import Slider from 'react-slick'
import { format } from 'date-fns'
import parse from 'html-react-parser'
import * as R from 'ramda'
import { useEffect, useState, useRef, PropsWithChildren } from 'react'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import { Trip, TripMember } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
import { trimMessage } from 'src/@core/utils/string'
import { useRouter } from 'next/router'

export const DefaultCoverTripImage =
  'https://img.freepik.com/free-vector/gradient-spring-illustration_23-2149264032.jpg?w=1380&t=st=1710694509~exp=1710695109~hmac=99468e4d3221b7e0b1890066b623b4fc51c382dc7a2f0c68bbdd92ad88a0cc42'

interface TripDetailsProps {
  tripID: string
  isShortDescription?: boolean
  fullWidth?: boolean
}

export default function TripDetailComponent({
  fullWidth = false,
  tripID,
  isShortDescription = false
}: TripDetailsProps) {
  const { tripAPI } = useApi()
  const theme: Theme = useTheme()

  const { findTripByID } = tripAPI
  const { data } = findTripByID

  // IMAGES
  const getResponsiveHeight = () => {
    if (typeof window === 'undefined') return 'calc(100vw * 0.8)' // Default height if window is not available
    const width = window.innerWidth
    if (width >= 1200) return 'calc(50vw * 0.7)'
    if (width >= 900) return 'calc(50vw * 0.7)'
    else if (width >= 600) return 'calc(50vw * 0.8)'

    return 'calc(60vw * 0.8)'
  }

  const [height, setHeight] = useState(getResponsiveHeight())

  const dotsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleResize = () => setHeight(getResponsiveHeight())
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    findTripByID.mutate(tripID)
  }, [tripID])

  const trip = data as Trip | undefined
  const profiler = trip?.profiler

  if (R.isNil(trip) || R.isNil(profiler)) {
    return <LoadingComponent />
  }

  const imgSrc: string[] = R.isEmpty(trip?.data.cover_images)
    ? [DefaultCoverTripImage]
    : trip?.data.cover_images.map(v => v.signed_url)

  const Dot = styled.div`
    margin-top: 3em;
    width: 10px;
    height: 10px;
    background-color: rgba(67, 224, 208, 0.8);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.1s, transform 0.1s;
    outline: none;
    &:hover {
      background-color: rgba(67, 200, 156, 1);
    }
    &:focus {
      background-color: rgba(200, 100, 50, 1);
      transform: scale(1.2);
    }
  `

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'center',
    centerMode: true,
    centerPadding: '10%',
    customPaging: (i: number) => (
      <Dot
        ref={el => {
          dotsRef.current[i] = el
        }}
        tabIndex={0}
      />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <ul style={{ margin: '0', padding: '0', display: 'flex', listStyleType: 'none' }}>{dots}</ul>
      </div>
    ),
    afterChange: (current: number) => {
      if (dotsRef.current[current]) {
        dotsRef.current[current]?.focus()
      }
    }
  }

  const imageCarousel = (
    <div style={{ paddingBottom: '2em' }}>
      <Slider {...settings}>
        {imgSrc.map((v, index) => {
          return (
            <div key={index}>
              <img
                src={v}
                alt='image of the trip'
                style={{
                  width: '95%',
                  height,
                  objectFit: 'cover',
                  borderRadius: '20px'
                }}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )

  // RICH TEXT
  const htmlString = trip?.data?.description
  const msg = trimMessage(htmlString, 300)
  const parsedHtml = parse(isShortDescription ? msg : htmlString)
  const DescriptionHTML = () => <>{parsedHtml}</>

  // AVATAR
  const profilerAvatar = !R.isNil(profiler?.data?.logo_image?.signed_url) ? (
    <Avatar src={profiler?.data?.logo_image?.signed_url || ''} />
  ) : (
    <Avatar>{profiler?.data?.name[0]}</Avatar>
  )

  // MEMBER AVATAR
  const goingAvatars = <GoingAvatars members={data?.data?.members ?? []} />

  return (
    <Card style={{ margin: 0, maxWidth: '1200px', width: fullWidth ? '100vw' : 'auto' }}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5em'
        }}
      >
        <Typography gutterBottom variant='h5' component='div' style={{ fontWeight: 'bold' }}>
          {trip?.data?.title}
        </Typography>
        <Chip
          label={toCurrency(trip.data.payment?.full_price || 0.0)}
          color='secondary'
          sx={{
            height: '2em',
            fontSize: '1rem',
            textTransform: 'capitalize',
            '& .MuiChip-label': { fontWeight: 500 }
          }}
        />
      </Box>

      {imgSrc.length === 1 ? (
        <CardMedia component='img' image={imgSrc[0]} alt='image of trip' sx={{ maxHeight: 500 }} />
      ) : (
        imageCarousel
      )}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '1em' }}>
              <div style={{ display: 'flex', paddingBottom: '0.6em' }}>
                <TourIcon style={{ color: theme.palette.info.main }} />
                <Typography
                  variant='body2'
                  color={theme.palette.info.main}
                  style={{ paddingLeft: '0.5em', fontWeight: 'bold' }}
                >
                  ทริปลีดเดอร์
                </Typography>
              </div>
              <Link
                href={`/profiler/${trip?.profiler_id}`}
                sx={{
                  '&:hover': {
                    color: '#000000',
                    textDecoration: 'underline #000000'
                  },
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div style={{}}>{profilerAvatar}</div>
                <Typography variant='body1' color='text.primary' style={{ paddingLeft: '1em', fontWeight: 'bold' }}>
                  {profiler.data.name}
                </Typography>
              </Link>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
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
              <div style={{ paddingLeft: '0.8em' }}>{goingAvatars}</div>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.6em' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <AlternateEmail style={{ color: theme.palette.info.dark, width: '0.8em' }} />
                <Typography
                  variant='body2'
                  color={theme.palette.info.dark}
                  style={{ paddingLeft: '0.5em', fontWeight: 'bold' }}
                >
                  ติดต่อ
                </Typography>
              </div>
              {trip?.data?.contacts.map((v, id) => {
                return (
                  <div style={{ display: 'flex', paddingBottom: '0.3em' }} key={id}>
                    <Typography
                      variant='body2'
                      color={theme.palette.info.dark}
                      style={{ paddingLeft: '0.1em', fontWeight: 'bold' }}
                    >
                      {v.contact_type}
                    </Typography>
                    <a href={v.link} rel='noopener noreferrer' target='_blank' style={{ textDecoration: 'none' }}>
                      <Typography variant='body2' color={theme.palette.info.dark} style={{ paddingLeft: '0.5em' }}>
                        {v.link}
                      </Typography>
                    </a>
                  </div>
                )
              })}
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ marginTop: 10 }}>
              <DescriptionHTML />
            </div>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <BookingButton tripID={tripID} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const AvatarWrapper = styled(Box)`
  display: flex;
  align-items: center;
`

const StackedAvatar = styled(Avatar)<{ index: number }>`
  z-index: ${({ index }) => 100 - index};
  margin-left: ${({ index }) => (index > 0 ? '-18px' : '0')}; // Adjust stacking overlap
  border: 2px solid white;
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

interface BookingButtonProps {
  tripID: string
}

const BookingButton = ({ tripID }: PropsWithChildren<BookingButtonProps>): JSX.Element | null => {
  const router = useRouter()
  const hideElement = Boolean(router.query.hideElement) || false

  return !hideElement ? (
    <Button
      variant='contained'
      color='secondary'
      onClick={() => router.push(`/booking/${tripID}`)}
      sx={{
        position: 'relative',
        filter: 'drop-shadow(1px 1px 1px #444)',
        fontSize: '1em',
        alignSelf: 'center',
        zIndex: 10000,
        width: {
          xs: '90%', // Full width on mobile
          sm: '50%', // Half width on small screens
          md: '40%', // 40% width on medium screens
          lg: '30%', // 30% width on large screens
          xl: '20%' // 20% width on extra-large screens
        }
      }}
    >
      จอง
    </Button>
  ) : (
    <></>
  )
}
