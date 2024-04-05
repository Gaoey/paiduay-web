import { Grid } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Trip, TripFilter } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'
import * as R from 'ramda'

export default function TripList() {
  const router = useRouter()
  const { tripAPI } = useApi()
  const { findTrips } = tripAPI

  const { data } = findTrips
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
      <Grid container spacing={7}>
        <Grid
          item
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        ></Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

TripList.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
