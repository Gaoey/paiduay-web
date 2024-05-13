import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { getSessionFromCookie } from 'src/@core/utils/session'
import UserLayout from 'src/layouts/UserLayout'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function UserTripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  return (
    <ApexChartWrapper>
      <Grid container spacing={7} style={{ paddingBottom: '6em' }}>
        <Grid
          item
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TripDetailComponent tripID={tripID} fullWidth={true} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

UserTripDetail.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
