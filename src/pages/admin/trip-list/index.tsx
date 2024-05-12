// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { ReactNode } from 'react'
import AdminLayout from 'src/layouts/AdminLayout'
import TripList from 'src/views/admin/TripList'
import { getSessionFromCookie } from 'src/@core/utils/session'

const TripListPage = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TripList />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

TripListPage.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}

export default TripListPage
