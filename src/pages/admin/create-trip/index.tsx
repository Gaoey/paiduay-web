// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Icons Imports

// ** Demo Tabs Imports

// ** Third Party Styles Imports
import { getSession } from 'next-auth/react'
import 'react-datepicker/dist/react-datepicker.css'
import { SubmitHandler } from 'react-hook-form'
import { useApi } from 'src/@core/services'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Profiler } from 'src/@core/types/profiler'
import AdminLayout from 'src/layouts/AdminLayout'
import TripForm from 'src/views/admin/TripForm'
import * as R from 'ramda'
import { TripData, TripStatus } from 'src/@core/types/trip'
import { useRouter } from 'next/router'

const CreateTrip = () => {
  const router = useRouter()
  const { tripAPI, profilerAPI } = useApi()

  const { getCurrentProfiler } = profilerAPI
  const { createTrip } = tripAPI

  const { isSuccess, data } = createTrip

  const onSubmit: SubmitHandler<any> = async data => {
    const profiler: Profiler[] = await getCurrentProfiler()
    if (!R.isEmpty(profiler)) {
      const currentProfiler: Profiler = profiler[0]
      const params = data as TripData
      const newParams: TripData = {
        ...params,
        status: TripStatus[TripStatus.NotFull],
        payment: {
          full_price: Number(params?.payment?.full_price),
          deposit_price: Number(params?.payment?.deposit_price),
          payment_date: params?.payment?.payment_date || new Date()
        },
        total_people: Number(params?.total_people)
      }
      createTrip.mutate({ profilerID: currentProfiler._id, params: newParams })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/admin/trip-list/${data?._id}`)
    }
  }, [data?._id, isSuccess, router])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TripForm onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

CreateTrip.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default CreateTrip
