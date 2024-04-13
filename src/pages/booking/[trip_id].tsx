import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { Transport, Transportation } from 'src/@core/types/transport'
import UserLayout from 'src/layouts/UserLayout'
import * as R from 'ramda'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Card, Grid, TextField, Typography } from '@mui/material'
import { TransportationNormalBookingForm, VanBookingForm } from 'src/views/trip/TransportationForm'

export default function BookingTrip() {
  const router = useRouter()
  const tripID = router.query.trip_id as string

  const { transportAPI } = useApi()

  const { findTransportByTripID } = transportAPI
  const { data } = findTransportByTripID
  const transports = R.pathOr<Transport[]>([], [], data)

  useEffect(() => {
    findTransportByTripID.mutate(tripID)
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={12}>
          <Typography variant='h4' sx={{ textAlign: 'center' }}>จองที่นั่งเดินทาง</Typography>
        </Grid>
        <Grid item md={12}>
          {!R.isEmpty(transports) &&
            transports.map(item => {
              if (item.data.transport_by === Transportation[Transportation.VAN]) {
                return (
                  <Card style={{ padding: '1.5em', marginBottom: 40 }} key={item.trip_id}>
                    <Grid container spacing={7} key={item._id}>
                      <Grid item xs={4}>
                        <TextField label='Name' defaultValue={item.data.name} fullWidth disabled />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField label='Transport By' defaultValue={item.data.transport_by} disabled />
                      </Grid>
                      <Grid item xs={12}>
                        <VanBookingForm values={item.data.seats} tripID={tripID} transportID={item._id} />
                      </Grid>
                    </Grid>
                  </Card>
                )
              } else {
                return <TransportationNormalBookingForm key={item._id} />
              }
            })}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

BookingTrip.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
