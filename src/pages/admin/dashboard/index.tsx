// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { LoadingComponent } from 'src/@core/components/loading'
import { useAdminAccount } from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'
import { Profiler } from 'src/@core/types/profiler'
import AdminLayout from 'src/layouts/AdminLayout'
import TripList from 'src/views/admin/TripList'
import Profile from 'src/views/dashboard/Profile'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import { getSessionFromCookie } from 'src/@core/utils/session'

const Dashboard = () => {
  const router = useRouter()
  const { profilerAPI, userAPI } = useApi()

  const { getUser } = userAPI
  const { findProfiler } = profilerAPI

  const currentUser = getUser

  const { data, isLoading } = findProfiler

  const profiler: Profiler | null = R.pathOr<Profiler | null>(null, [0], data)

  useEffect(() => {
    findProfiler.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { isSuccess, isLoading: isAdminLoading, isAdmin } = useAdminAccount()

  // ** Effects
  useEffect(() => {
    if (isSuccess && !isAdmin) {
      router.push('/admin/create-profiler')
    }
  }, [isAdmin, isSuccess, router])

  if (isAdminLoading) {
    return (
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <LoadingComponent />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    )
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Profile profiler={profiler} isLoading={isLoading} currentUser={currentUser} />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TotalEarning />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$25.6k'
                icon={<Poll />}
                color='success'
                trendNumber='+42%'
                title='Total Profit'
                subtitle='Weekly Profit'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$78'
                title='Refunds'
                trend='negative'
                color='secondary'
                trendNumber='-15%'
                subtitle='Past Month'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='862'
                trend='negative'
                trendNumber='-18%'
                title='New Project'
                subtitle='Yearly Project'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='15'
                color='warning'
                trend='negative'
                trendNumber='-18%'
                subtitle='Last Week'
                title='Sales Queries'
                icon={<HelpCircleOutline />}
              />
            </Grid>
          </Grid>
        </Grid> */}
        <Grid item xs={12}>
          <TripList />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

Dashboard.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}

export default Dashboard
