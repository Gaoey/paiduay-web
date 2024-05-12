import { Grid, Paper } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Paginate } from 'src/@core/types'
import { Profiler } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import { getSessionFromCookie } from 'src/@core/utils/session'
import UserLayout from 'src/layouts/UserLayout'
import ProfilerCard from 'src/views/user/ProfilerCard'
import TripCardList from 'src/views/user/TripCardList'

export default function ProfilePage() {
  const router = useRouter()
  const { profilerAPI, tripAPI } = useApi()
  const { findProfilerByProfilerID } = profilerAPI
  const { findTripByProfilerID } = tripAPI
  const profilerID = router.query.id as string

  const { data: ProfilerData } = findProfilerByProfilerID
  const { data: TripData, isLoading: isTripsLoading } = findTripByProfilerID
  const profiler = R.pathOr<Profiler | null>(null, [], ProfilerData)
  const trips = R.pathOr<Trip[]>([], [], TripData)

  useEffect(() => {
    findProfilerByProfilerID.mutate(profilerID)

    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }
    findTripByProfilerID.mutate({ profilerID, paginate })
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item xs={12}>
          {!R.isNil(profiler) && (
            <Paper>
              <ProfilerCard profiler={profiler} />
            </Paper>
          )}
        </Grid>
        <Grid item xs={12}>
          <TripCardList isLoading={isTripsLoading} trips={trips} hideProfiler />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

ProfilePage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
