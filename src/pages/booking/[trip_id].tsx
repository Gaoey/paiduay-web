import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Transport } from 'src/@core/types/transport'
import { getSessionFromCookie } from 'src/@core/utils/session'
import UserLayout from 'src/layouts/UserLayout'
import { ViewTransportationTab } from 'src/views/user/TransportationForm'

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
        <Grid item md={12} xs={12}>
          <Typography variant='h4' sx={{ textAlign: 'center' }}>
            จองที่นั่งเดินทาง
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <ViewTransportationTab tripID={tripID} transports={transports} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

BookingTrip.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
