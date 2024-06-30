import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Media } from 'src/@core/types'
import { Transport, TransportData } from 'src/@core/types/transport'
import { Trip, TripData, TripPayload, TripStatus } from 'src/@core/types/trip'
import { getSessionFromCookie } from 'src/@core/utils/session'
import AdminLayout from 'src/layouts/AdminLayout'
import TripForm from 'src/views/admin/TripForm'

export default function UpdateTrip() {
  const router = useRouter()
  const tripID = router.query.id as string
  const { tripAPI, mediaAPI, transportAPI } = useApi()
  const { findTripByID } = tripAPI
  const { findTransportByTripID } = transportAPI

  const { data: tripData } = findTripByID
  const { data: transportData } = findTransportByTripID
  const trip: Trip | null = R.pathOr<Trip | null>(null, [], tripData)
  const transports: Transport[] = R.pathOr<Transport[]>([], [], transportData)

  const { api } = tripAPI
  const { uploadMedias } = mediaAPI
  const updateTrip = useMutation(api.updateTrip, {
    onSuccess: () => {
      router.push(`/admin/trip-list/${tripID}`)
    }
  })

  const { isLoading: isUpdateTripLoading } = updateTrip

  const { isLoading } = uploadMedias

  const onSubmit: SubmitHandler<any> = async data => {
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

    const medias: Media[] = R.pathOr<Media[]>([], ['cover_images'], params)
    const filterMedias: Media[] = medias.filter(v => R.isEmpty(v.signed_url))
    if (!R.isEmpty(filterMedias)) {
      const newUpdateMedias: Media[] = await uploadMedias.mutateAsync(filterMedias)
      const oldMedias: Media[] = medias.filter(v => !R.isEmpty(v.signed_url))
      const newMedias = [...oldMedias, ...newUpdateMedias]
      tripData.cover_images = newMedias
    }

    updateTrip.mutate({ tripID, params: tripData })
  }

  useEffect(() => {
    findTripByID.mutate(tripID)
    findTransportByTripID.mutate(tripID)
  }, [tripID])

  if (R.isNil(trip) || isLoading) {
    return <LoadingComponent />
  }

  const payload: TripPayload = {
    trip_data: trip?.data,
    transport_data: transports.map(v => v.data)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TripForm
            onSubmit={onSubmit}
            trip_payload={payload}
            isHiddenTransport={true}
            isLoading={isUpdateTripLoading || isLoading}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

UpdateTrip.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
