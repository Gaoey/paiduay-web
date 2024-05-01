import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Media } from 'src/@core/types'
import { Booking, BookingData, BookingStatus, PaymentType } from 'src/@core/types/booking'
import { Profiler } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'
import BookingForm, { getPaymentPrice } from 'src/views/user/BookingForm'

export default function UpdateBooking() {
  const router = useRouter()

  const tripID = router.query.id as string
  const bookingID = router.query.booking_id as string

  const { tripAPI, profilerAPI, bookingAPI, userAPI, mediaAPI } = useApi()
  const { uploadMedias } = mediaAPI
  const { user } = userAPI
  const { findTripByID } = tripAPI
  const { findProfilerByTripID } = profilerAPI
  const { updateBooking, findBookingByID } = bookingAPI

  const { data: userData } = user
  const { data: findTripData } = findTripByID
  const { data: findProfilerData } = findProfilerByTripID
  const { data: bookingData } = findBookingByID

  const { isLoading: isUploadMediaLoading } = uploadMedias
  const { isSuccess, isLoading: isUpdateBookingLoading } = updateBooking

  const trip = R.pathOr<Trip | null>(null, [], findTripData)
  const booking = R.pathOr<Booking | null>(null, [], bookingData)
  const profiler = R.pathOr<Profiler | null>(null, [], findProfilerData)

  useEffect(() => {
    user.mutate()
    findBookingByID.mutate(bookingID)
    findTripByID.mutate(tripID)
    findProfilerByTripID.mutate(tripID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit: SubmitHandler<any> = async data => {
    if (!R.isNil(data?.slip_image) && !R.isNil(userData?._id) && !R.isNil(trip?.data?.payment) && !R.isNil(booking)) {
      const newMedias: Media[] = await uploadMedias.mutateAsync(data?.slip_image)

      if (trip?.data?.payment.full_price && trip?.data?.payment.payment_date) {
        const bookingData: BookingData = {
          ...booking.data,
          payment_type: data?.payment_type,
          payment_price: getPaymentPrice(trip?.data?.payment, data?.seats.length, data?.payment_type),
          status:
            data?.payment_type === PaymentType[PaymentType.DEPOSIT]
              ? BookingStatus[BookingStatus.DEPOSIT]
              : BookingStatus[BookingStatus.PENDING],
          slips: [...booking.data.slips, newMedias[0]]
        }

        updateBooking.mutate({ bookingID, tripID, params: bookingData })
      }
    }
  }

  const totalPrice = trip?.data?.payment?.full_price || 0.0

  useEffect(() => {
    if (isSuccess) {
      router.push(`/trips/${tripID}/booking/success`)
    }
  }, [isSuccess])

  const isLoading = R.isNil(trip) || R.isNil(profiler) || R.isNil(booking)

  return (
    <ApexChartWrapper>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        !R.isNil(trip) &&
        !R.isNil(profiler) &&
        !R.isNil(booking) && (
          <BookingForm
            trip={trip}
            booking={booking}
            profiler={profiler}
            seats={booking?.data.seats || []}
            totalPrice={totalPrice}
            onSubmit={onSubmit}
            isDeposit={true}
            isLoading={isUploadMediaLoading || isUpdateBookingLoading}
          />
        )
      )}
    </ApexChartWrapper>
  )
}

UpdateBooking.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
