// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Icons Imports

// ** Demo Tabs Imports

// ** Third Party Styles Imports
import { useRouter } from 'next/router'
import * as R from 'ramda'
import 'react-datepicker/dist/react-datepicker.css'
import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useApi } from 'src/@core/services'
import { Media } from 'src/@core/types'
import { Profiler } from 'src/@core/types/profiler'
import { Seat, SeatStatus, TransportData } from 'src/@core/types/transport'
import { Trip, TripData, TripPayload, TripStatus } from 'src/@core/types/trip'
import { getSessionFromCookie } from 'src/@core/utils/session'
import AdminLayout from 'src/layouts/AdminLayout'
import TripForm from 'src/views/admin/TripForm'

const CreateTrip = () => {
  const router = useRouter()
  const { tripAPI, profilerAPI, mediaAPI } = useApi()

  const { getCurrentProfiler } = profilerAPI
  const { api } = tripAPI
  const { uploadMedias } = mediaAPI

  const createTrip = useMutation(api.createTrip, {
    onSuccess: (data: Trip) => {
      router.push(`/admin/trip-list/${data?._id}`)
    }
  })

  const { isLoading } = createTrip
  const { isLoading: isUploadMediaLoading } = uploadMedias

  const onSubmit: SubmitHandler<any> = async data => {
    const profiler: Profiler[] = await getCurrentProfiler()
    if (!R.isEmpty(profiler)) {
      const currentProfiler: Profiler = profiler[0]
      const params = data as TripData & { transport_data: TransportData[] }

      const tripData: TripData = {
        ...params,
        status: TripStatus[TripStatus.NotFull],
        payment: {
          full_price: Number(params?.payment?.full_price),
          deposit_price: Number(params?.payment?.deposit_price),
          payment_date: params?.payment?.payment_date || new Date()
        },
        total_people: Number(params?.total_people)
      }

      const media: Media[] = R.pathOr<Media[]>([], ['cover_images'], params)
      if (!R.isEmpty(media)) {
        const newMedias: Media[] = await uploadMedias.mutateAsync(media)
        tripData.cover_images = newMedias
      }

      const transport_data: TransportData[] = params.transport_data.map((v: TransportData) => {
        return {
          ...v,
          total_seats: Number(v.total_seats),
          seats: v.seats.map((u: Seat) => {
            return {
              ...u,
              name: `#${u.seat_number}`,
              seat_number: Number(u.seat_number),
              status: u.is_lock ? SeatStatus[SeatStatus.RESERVE] : SeatStatus[SeatStatus.EMPTY]
            }
          })
        }
      })

      const payload: TripPayload = {
        trip_data: tripData,
        transport_data: transport_data
      }

      createTrip.mutate({ profilerID: currentProfiler._id, params: payload })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TripForm onSubmit={(data: any) => onSubmit(data)} isLoading={isUploadMediaLoading || isLoading} />
      </Grid>
    </Grid>
  )
}

CreateTrip.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}

export default CreateTrip
