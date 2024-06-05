import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Booking, BookingData, BookingFilter } from 'src/@core/types/booking'
import { Seat, Transport, TransportData, Transportation } from 'src/@core/types/transport'
import AdminLayout from 'src/layouts/AdminLayout'
import BookingCard from 'src/views/admin/BookingList'
import RemoveTripPopUp from 'src/views/admin/RemoveTripPopUp'
import TransportDetail, { AddTransportButton } from 'src/views/admin/TransportDetail'
import TripDetailComponent from 'src/views/admin/TripDetail'
import { useMediaQuery, useTheme } from '@mui/material'
import { getSessionFromCookie } from 'src/@core/utils/session'
import LinkIcon from '@mui/icons-material/Link'
import { Tooltip } from '@mui/material'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'

export default function TripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  const { transportAPI, bookingAPI, tripAPI } = useApi()

  const { removeTrip } = tripAPI
  const { findBookings, updateBooking } = bookingAPI
  const { findTransportByTripID, updateSeatByTransportID, removeTransport, updateTransport, createTransport } =
    transportAPI

  const { isSuccess: isRemoveTransportSuccess } = removeTransport
  const { isSuccess: isRemoveTripSuccess } = removeTrip
  const { data } = findTransportByTripID
  const { data: findBookingsData } = findBookings
  const { isSuccess } = updateSeatByTransportID
  const { isSuccess: isUpdateBookingSuccess } = updateBooking
  const { isSuccess: isUpdateTransportSuccess } = updateTransport
  const { isSuccess: isCreateTransportSuccess } = createTransport

  const transports = R.pathOr<Transport[]>([], [], data)
  const bookings = R.pathOr<Booking[]>([], [], findBookingsData)

  const onSetSeat = (seats: Seat[]) => {
    if (!R.isNil(seats[0].transport_id)) {
      const transportID = seats[0].transport_id
      updateSeatByTransportID.mutate({ tripID, transportID, seats })
    }
  }

  const onUpdateBooking = (bookingID: string, params: BookingData) => {
    updateBooking.mutate({ bookingID, tripID, params })
  }

  useEffect(() => {
    findTransportByTripID.mutate(tripID)

    const filters: BookingFilter = { trip_id: tripID }
    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }
    findBookings.mutate({ filters, paginate })
  }, [tripID])

  useEffect(() => {
    if (isSuccess || isRemoveTransportSuccess || isUpdateTransportSuccess || isCreateTransportSuccess) {
      findTransportByTripID.mutate(tripID)
    }
  }, [isSuccess, isRemoveTransportSuccess, isUpdateTransportSuccess, isCreateTransportSuccess])

  useEffect(() => {
    if (isRemoveTripSuccess) {
      router.replace('/admin/trip-list/')
    }
  }, [isRemoveTripSuccess])

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      const filters: BookingFilter = { trip_id: tripID }
      const paginate: Paginate = {
        page_size: 100,
        page_number: 1
      }
      findBookings.mutate({ filters, paginate })
      findTransportByTripID.mutate(tripID)
    }
  }, [isUpdateBookingSuccess, tripID])

  const numberOfVans = transports.filter(x => x.data.transport_by === Transportation[Transportation.VAN]).length
  const numberOfAlternativeVehicles = transports.length - numberOfVans

  const theme = useTheme()
  const screenIsWide = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={6} xs={12}>
          <Grid container spacing={7}>
            <Grid item md={12}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Tooltip title='Preview' arrow>
                  <Button
                    variant='contained'
                    style={{ color: 'white', marginRight: 20 }}
                    onClick={() => router.push(`/trips/${tripID}?hideElement=true`)}
                  >
                    <RemoveRedEyeOutlinedIcon />
                  </Button>
                </Tooltip>
                <CopyLinkButton tripID={tripID} />
                <Button
                  variant='outlined'
                  style={{ marginRight: 20 }}
                  onClick={() => router.push(`/admin/update-trip/${tripID}`)}
                >
                  แก้ไขรายละเอียด
                </Button>
                <RemoveTripPopUp tripID={tripID} onRemove={(tripID: string) => removeTrip.mutate(tripID)} />
              </Box>
            </Grid>
            <Grid item md={12} xs={12}>
              <TripDetailComponent tripID={tripID} isShortDescription fullWidth={!screenIsWide} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid container spacing={7}>
            <Grid item md={12}>
              <Typography variant='h5'>Transports</Typography>
            </Grid>
            <Grid item md={12}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <AddTransportButton
                  title={'เพิ่มรถตู้'}
                  tripID={tripID}
                  transportBy={Transportation[Transportation.VAN]}
                  onCreateTransport={(tripID: string, transportData: TransportData) => {
                    createTransport.mutate({ tripID, transportData: [transportData] })
                  }}
                  transportNumber={numberOfVans + 1}
                />
                <AddTransportButton
                  title={'เพิ่อวิธีการเดินทางแบบอื่น'}
                  tripID={tripID}
                  transportBy={Transportation[Transportation.SELF]}
                  onCreateTransport={(tripID: string, transportData: TransportData) => {
                    createTransport.mutate({ tripID, transportData: [transportData] })
                  }}
                  transportNumber={numberOfAlternativeVehicles + 1}
                />
              </Box>
            </Grid>

            <Grid item md={12}>
              {!R.isEmpty(transports) &&
                transports.map(item => {
                  return (
                    <TransportDetail
                      key={item._id}
                      item={item}
                      onSetSeat={onSetSeat}
                      onUpdateTransport={(transportID, transportData) => {
                        updateTransport.mutate({ tripID, transportID, transportData })
                      }}
                      onRemoveTransport={(tripID: string, transportID: string) =>
                        removeTransport.mutate({ tripID, transportID })
                      }
                    />
                  )
                })}
            </Grid>
          </Grid>
        </Grid>
        {!R.isEmpty(bookings) && (
          <>
            <Grid item md={12}>
              <Typography variant='h5'>Payments</Typography>
            </Grid>
            <Grid item md={12}>
              <BookingCard bookings={bookings} transports={transports} onUpdateBooking={onUpdateBooking} />
            </Grid>
          </>
        )}
      </Grid>
    </ApexChartWrapper>
  )
}

TripDetail.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  try {
    const session = await getSessionFromCookie(ctx)

    return {
      props: {
        session
      }
    }
  } catch (error) {
    return { props: { error: 'Failed to get sessions' } }
  }
}

const CopyLinkButton = ({ tripID }: any) => {
  const [copied, setCopied] = useState(false)
  const theme = useTheme()

  const handleCopyLink = () => {
    const url = window ? `${window.location.origin}/trips/${tripID}` : `www.paiduay.com/trips/${tripID}`

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <>
      <Tooltip title='Copy link' arrow>
        <Button
          variant='contained'
          color='secondary'
          style={{ color: 'white', marginRight: 20 }}
          onClick={handleCopyLink}
        >
          <LinkIcon />
        </Button>
      </Tooltip>
      {copied && (
        <Typography
          variant='body2'
          color='primary'
          style={{
            position: 'fixed',
            backgroundColor: theme.palette.info.light,
            padding: '1em',
            borderRadius: '1em'
          }}
        >
          Link copied to clipboard!
        </Typography>
      )}
    </>
  )
}
