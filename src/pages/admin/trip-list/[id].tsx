import { Grid, TextField } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Transport, Transportation } from 'src/@core/types/transport'
import AdminLayout from 'src/layouts/AdminLayout'
import TripDetailComponent from 'src/views/admin/TripDetail'
import * as R from 'ramda'
import { TransportationNormalForm, VanForm } from 'src/views/admin/TransportationForm'

export default function TripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  const { transportAPI } = useApi()

  const { findTransportByTripID } = transportAPI
  const { data } = findTransportByTripID
  const transports = R.pathOr<Transport[]>([], [], data)

  useEffect(() => {
    findTransportByTripID.mutate(tripID)
  }, [])

  console.log({ transports })

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={6} xs={12}>
          <TripDetailComponent tripID={tripID} />
        </Grid>
        <Grid item md={6} xs={12}>
          {!R.isEmpty(transports) &&
            transports.map(item => {
              if (item.data.transport_by === Transportation[Transportation.VAN]) {
                return (
                  <Grid container spacing={7} key={item._id} style={{ marginBottom: 40 }}>
                    <Grid item xs={4}>
                      <TextField label='Name' defaultValue={item.data.name} fullWidth disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField label='Transport By' defaultValue={item.data.transport_by} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <VanForm values={item.data.seats} isShow />
                    </Grid>
                  </Grid>
                )
              } else {
                return <TransportationNormalForm />
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
