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
  const hideElement = Boolean(router.query.hideElement) || false

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
          <TripDetailComponent tripID={tripID} />
        </Grid>
      </Grid>
      {!hideElement && (
        <div style={{ position: 'fixed', bottom: '2em', textAlign: 'center', width: '100%' }}>
          <Button
            variant='contained'
            color='secondary'
            style={{ filter: 'drop-shadow(1px 1px 1px #444)', fontSize: '1em' }}
            onClick={() => router.push(`/booking/${tripID}`)}
          >
            จอง
          </Button>
        </div>
      )}
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
