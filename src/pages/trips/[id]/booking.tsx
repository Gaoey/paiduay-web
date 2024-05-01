import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Media } from 'src/@core/types'
import { BookingData, BookingStatus, PaymentType, SimplySeatData } from 'src/@core/types/booking'
import { Profiler } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'
import BookingForm, { getPaymentPrice } from 'src/views/user/BookingForm'

export default function Booking() {
  const router = useRouter()

  const tripID = router.query.id as string
  const transport_id = router.query.transport_id as string
  const seat_numbers = router.query.seat_number as string[] | string

  const { tripAPI, profilerAPI, bookingAPI, userAPI, mediaAPI } = useApi()
  const { uploadMedias } = mediaAPI
  const { user } = userAPI
  const { findTripByID } = tripAPI
  const { findProfilerByTripID } = profilerAPI
  const { createBooking } = bookingAPI

  const { data: userData } = user
  const { data: findTripData } = findTripByID
  const { data: findProfilerData } = findProfilerByTripID
  const { isSuccess } = createBooking
  const trip = R.pathOr<Trip | null>(null, [], findTripData)
  const profiler = R.pathOr<Profiler | null>(null, [], findProfilerData)

  useEffect(() => {
    user.mutate()
    findTripByID.mutate(tripID)
    findProfilerByTripID.mutate(tripID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const simplySeats = (): SimplySeatData[] => {
    if (typeof seat_numbers === 'string') {
      return [
        {
          seat_number: Number(seat_numbers),
          seat_name: ''
        }
      ]
    } else {
      return seat_numbers.map(v => {
        return {
          seat_number: Number(v),
          seat_name: ''
        }
      })
    }
  }

  const onSubmit: SubmitHandler<any> = async data => {
    if (!R.isNil(data?.slip_image) && !R.isNil(userData?._id) && !R.isNil(trip?.data?.payment)) {
      const newMedias: Media[] = await uploadMedias.mutateAsync(data?.slip_image)

      if (trip?.data?.payment.full_price && trip?.data?.payment.payment_date) {
        const bookingData: BookingData = {
          user_id: userData?._id as string,
          transport_id: transport_id,
          seats: data?.seats || [],
          payment_type: data?.payment_type,
          payment_price: getPaymentPrice(trip?.data?.payment, data?.seats.length, data?.payment_type),
          status:
            data?.payment_type === PaymentType[PaymentType.DEPOSIT]
              ? BookingStatus[BookingStatus.DEPOSIT]
              : BookingStatus[BookingStatus.PENDING],
          slips: [newMedias[0]]
        }

        createBooking.mutate({ tripID, params: bookingData })
      }
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/trips/${tripID}/booking/success`)
    }
  }, [isSuccess])

  const totalPrice = trip?.data?.payment?.full_price || 0.0
  const isLoading = R.isNil(trip) && R.isNil(profiler)

  return (
    <ApexChartWrapper>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        !R.isNil(trip) &&
        !R.isNil(profiler) && (
          <BookingForm
            trip={trip}
            profiler={profiler}
            seats={simplySeats()}
            totalPrice={totalPrice}
            onSubmit={onSubmit}
          />
        )
      )}
    </ApexChartWrapper>
  )
}

Booking.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
