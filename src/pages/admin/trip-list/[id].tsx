import { Grid } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { SubmitHandler } from 'react-hook-form'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AdminLayout from 'src/layouts/AdminLayout'
import TransportationForm from 'src/views/admin/TransportationForm'
import TripDetailComponent from 'src/views/admin/TripDetail'

export default function TripDetail() {
  const router = useRouter()

  const onSubmit: SubmitHandler<any> = async data => {
    console.log(data)
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item xs={12} md={6}>
          <TripDetailComponent tripID={router.query.id as string} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransportationForm tripID={router.query.id as string} onSubmit={onSubmit} />
        </Grid>
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
