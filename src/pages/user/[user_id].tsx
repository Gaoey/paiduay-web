import { Grid, Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Booking } from 'src/@core/types/booking'
import UserLayout from 'src/layouts/UserLayout'
import BookingHistoryTable from 'src/views/user/BookingHistory'
import UserProfileForm from 'src/views/user/UserProfileForm'

export default function UserProfileDetail() {
  const router = useRouter()
  const userID = router.query.user_id as string

  const { bookingAPI } = useApi()

  const { findBookingsByUserID } = bookingAPI

  const { data } = findBookingsByUserID
  const bookings: Booking[] = R.pathOr<Booking[]>([], [], data)

  useEffect(() => {
    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }
    findBookingsByUserID.mutate({ paginate })
  }, [])

  console.log({ data })

  return (
    <ApexChartWrapper>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <Typography variant='h6' color='text.secondary'>
            Accounts
          </Typography>
        </Grid>
        <Grid item md={12}>
          <UserProfileForm userID={userID} />
        </Grid>
        <Grid item md={12}>
          <Typography variant='h6' color='text.secondary'>
            Booking History
          </Typography>
        </Grid>
        <Grid item md={12}>
          <BookingHistoryTable bookings={bookings} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

UserProfileDetail.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
