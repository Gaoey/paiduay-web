import { Button, Grid } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, PropsWithChildren } from 'react'
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
          <TripDetailComponent tripID={tripID} fullWidth={true} />
        </Grid>
      </Grid>
      <BookingButton tripID={tripID} hideElement={hideElement} />
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

interface BookingButtonProps {
  tripID: string
  hideElement: boolean
}

const BookingButton = ({ tripID, hideElement }: PropsWithChildren<BookingButtonProps>): JSX.Element | null => {
  const router = useRouter()

  return (
    !hideElement ? (
      <div
        style={{
          position: 'fixed',
          bottom: '2em',
          textAlign: 'center',
          width: '95vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          variant='contained'
          color='secondary'
          onClick={() => router.push(`/booking/${tripID}`)}
          sx={{
            position: 'relative',
            filter: 'drop-shadow(1px 1px 1px #444)',
            fontSize: '1em',
            alignSelf: 'center',
            width: {
              xs: '90%', // Full width on mobile
              sm: '50%', // Half width on small screens
              md: '40%', // 40% width on medium screens
              lg: '30%', // 30% width on large screens
              xl: '20%' // 20% width on extra-large screens
            }
          }}
        >
          จอง
        </Button>
      </div>
    ) : (<></>)
  )
}
