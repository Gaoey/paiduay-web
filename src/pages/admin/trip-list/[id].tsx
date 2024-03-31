import { Box, Button, Grid, TextField } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Seat, Transport, Transportation } from 'src/@core/types/transport'
import AdminLayout from 'src/layouts/AdminLayout'
import { TransportationNormalForm, VanForm } from 'src/views/admin/TransportationForm'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function TripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  const { transportAPI } = useApi()

  const { findTransportByTripID, updateSeatByTransportID } = transportAPI
  const { data } = findTransportByTripID
  const { isSuccess } = updateSeatByTransportID
  const transports = R.pathOr<Transport[]>([], [], data)

  const onSetSeat = (seats: Seat[]) => {
    if (!R.isNil(seats[0].transport_id)) {
      const transportID = seats[0].transport_id
      updateSeatByTransportID.mutate({ transportID, seats })
    }
  }

  useEffect(() => {
    findTransportByTripID.mutate(tripID)
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
