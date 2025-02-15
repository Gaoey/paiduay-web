import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Trip, TripFilter } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'
import TripCardList from 'src/views/user/TripCardList'
import { getSessionFromCookie } from 'src/@core/utils/session'

export default function TripList() {
  const { tripAPI } = useApi()
  const { findTrips } = tripAPI

  const { data, isLoading } = findTrips
  const trips = R.pathOr<Trip[]>([], [], data)

  useEffect(() => {
    const filter: TripFilter = { is_filter_going_date: true }
    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }

    findTrips.mutate({ filter, paginate })
  }, [])

  return (
    <ApexChartWrapper>
      <TripCardList isLoading={isLoading} trips={trips} />
    </ApexChartWrapper>
  )
}

TripList.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
