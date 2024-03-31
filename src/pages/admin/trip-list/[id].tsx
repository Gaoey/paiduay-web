import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Booking, BookingFilter } from 'src/@core/types/booking'
import { Seat, Transport, Transportation } from 'src/@core/types/transport'
import AdminLayout from 'src/layouts/AdminLayout'
import BookingTable from 'src/views/admin/BookingList'
import { TransportationNormalForm, VanForm } from 'src/views/admin/TransportationForm'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function TripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  const { transportAPI, bookingAPI } = useApi()

  const { findBookings } = bookingAPI
  const { findTransportByTripID, updateSeatByTransportID } = transportAPI
  const { data } = findTransportByTripID
  const { data: findBookingsData } = findBookings
  const { isSuccess } = updateSeatByTransportID
  const transports = R.pathOr<Transport[]>([], [], data)
  const bookings = R.pathOr<Booking[]>([], [], findBookingsData)

  const onSetSeat = (seats: Seat[]) => {
    if (!R.isNil(seats[0].transport_id)) {
      const transportID = seats[0].transport_id
      updateSeatByTransportID.mutate({ tripID, transportID, seats })
    }
  }

  useEffect(() => {
    findTransportByTripID.mutate(tripID)

    const filters: BookingFilter = { trip_id: tripID }
    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }
    findBookings.mutate({ filters, paginate })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      findTransportByTripID.mutate(tripID)
    }
  }, [isSuccess, tripID])

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={6} xs={12}>
          <Grid container spacing={7}>
            <Grid item md={12}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant='contained'
                  style={{ color: 'white', marginRight: 20 }}
                  onClick={() => router.push(`/trips/${tripID}`)}
                >
                  PREVIEW
                </Button>
                <Button variant='outlined' style={{ marginRight: 20 }}>
                  EDIT
                </Button>
                <Button variant='outlined'>REMOVE</Button>
              </Box>
            </Grid>
            <Grid item md={12}>
              <TripDetailComponent tripID={tripID} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          {!R.isEmpty(transports) &&
            transports.map(item => {
              if (item.data.transport_by === Transportation[Transportation.VAN]) {
                return (
                  <Grid container spacing={7} key={item._id} style={{ marginBottom: 40 }}>
                    <Grid item xs={6}>
                      <TextField label='Name' defaultValue={item.data.name} fullWidth disabled />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label='Transport By' defaultValue={item.data.transport_by} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <VanForm values={item.data.seats} onChange={(seat: Seat[]) => onSetSeat(seat)} />
                    </Grid>
                  </Grid>
                )
              } else {
                return <TransportationNormalForm key={item._id} />
              }
            })}
        </Grid>
        <Grid item md={12}>
          <Typography variant='h5'>PAYMENTS</Typography>
        </Grid>
        <Grid item md={12}>
          <BookingTable bookings={bookings} transports={transports} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

TripDetail.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
