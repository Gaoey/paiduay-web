import { Button, Grid } from '@mui/material'
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
        <Grid item md={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => router.push(`/booking/${tripID}`)}>
            จองที่
          </Button>
        </Grid>
      </Grid>
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
