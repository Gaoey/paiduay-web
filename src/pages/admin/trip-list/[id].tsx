import { Grid } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AdminLayout from 'src/layouts/AdminLayout'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function TripDetail() {
  const router = useRouter()

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item xs={12} md={6}>
          <TripDetailComponent tripID={router.query.id as string} />
        </Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

TripDetail.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
