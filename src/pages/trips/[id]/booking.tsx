import { Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UserLayout from 'src/layouts/UserLayout'
import * as R from 'ramda'
import { Trip } from 'src/@core/types/trip'
import { Profiler } from 'src/@core/types/profiler'

export default function Booking() {
  const router = useRouter()
  const { tripAPI, profilerAPI } = useApi()
  const { findTripByID } = tripAPI
  const { findProfilerByTripID } = profilerAPI
  const tripID = router.query.id as string
  const transport_id = router.query.transport_id as string
  const str_seat_number = router.query.seat_number as string
  const seat_number = Number(str_seat_number)

  const { data: findTripData } = findTripByID
  const { data: findProfilerData } = findProfilerByTripID
  const trip = R.pathOr<Trip | null>(null, [], findTripData)
  const profiler = R.pathOr<Profiler | null>(null, [], findProfilerData)

  useEffect(() => {
    findTripByID.mutate(tripID)
    findProfilerByTripID.mutate(tripID)
  }, [])

  const [slipImage, setSlipImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSlipImage(e.target.files[0])
    }
  }

  if (R.isNil(trip) && R.isNil(profiler)) {
    return <CircularProgress color='secondary' />
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            Payment
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {!R.isNil(profiler) &&
            profiler?.data?.bank_accounts.map(v => {
              return (
                <Card key={v?.account_number}>
                  <CardContent>
                    <Typography variant='h6'>Bank Account Details:</Typography>
                    <Typography variant='body1'>Bank Name: {v.bank_title}</Typography>
                    <Typography variant='body1'>Account Number: {v.account_number}</Typography>
                    <Typography variant='body1'>Account Name: {v.account_name}</Typography>
                  </CardContent>
                </Card>
              )
            })}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={7}>
                <Grid item xs={12}>
                  <Typography variant='h6'>Upload Payment Slip:</Typography>
                  <input type='file' accept='image/*' onChange={handleImageChange} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' color='primary'>
                    Submit Payment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

Booking.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
