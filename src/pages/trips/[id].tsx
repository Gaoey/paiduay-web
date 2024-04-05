import { Typography, Grid, Fab } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UserLayout from 'src/layouts/UserLayout'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function UserTripDetail() {
  const router = useRouter()
  const tripID = router.query.id as string

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={12}>
          <TripDetailComponent tripID={tripID} />
        </Grid>
      </Grid>
      <div style={{ position: 'fixed', bottom: '2em', right: '2em' }}>
        <Fab
          size='large'
          color='secondary'
          style={{ filter: 'drop-shadow(3px 3px 2px #aaa)', width: '3em', height: '3em', fontSize: '1.5em' }}
          onClick={() => router.push(`/booking/${tripID}`)}
        >
          จอง
        </Fab>
      </div>
    </ApexChartWrapper>
  )
}

UserTripDetail.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
