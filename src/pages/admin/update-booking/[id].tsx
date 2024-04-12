import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import { Booking } from 'src/@core/types/booking'
import * as R from 'ramda'
import AdminLayout from 'src/layouts/AdminLayout'
import { getSession } from 'next-auth/react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

export default function UpdateBooking() {
  const router = useRouter()
  const bookingID = router.query.id as string

  const { bookingAPI } = useApi()

  const { findBookingByID } = bookingAPI

  const { data } = findBookingByID
  const booking = R.pathOr<Booking | null>(null, [], data)

  useEffect(() => {
    findBookingByID.mutate(bookingID)
  }, [])

  return <ApexChartWrapper>[id]</ApexChartWrapper>
}

UpdateBooking.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
