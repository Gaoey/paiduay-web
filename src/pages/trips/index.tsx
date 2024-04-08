import { CircularProgress, Grid, Link, List, ListItem } from '@mui/material'
import { getSession } from 'next-auth/react'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Trip, TripFilter } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'
import TripCard from 'src/views/user/TripCard'

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
      <List>
        <Grid container spacing={7}>
          {isLoading ? (
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
          ) : (
            trips.map(item => (
              <Grid key={item._id} item xs={12} sm={12} md={4} lg={4}>
                <ListItem>
                  <Link target='_blank' href={`/trips/${item._id}`}>
                    <TripCard trip={item} />
                  </Link>
                </ListItem>
              </Grid>
            ))
          )}
        </Grid>
      </List>
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
