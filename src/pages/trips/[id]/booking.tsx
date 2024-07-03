import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { LoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import { Media } from 'src/@core/types'
import { BookingData, BookingStatus, PaymentType, SimplySeatData } from 'src/@core/types/booking'
import { Profiler } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import { getSessionFromCookie } from 'src/@core/utils/session'
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
  const { isLoading: isUploadMediaLoading } = uploadMedias
  const { isSuccess, isLoading: isCreateBookingLoading } = createBooking
  const trip = R.pathOr<Trip | null>(null, [], findTripData)
  const profiler = R.pathOr<Profiler | null>(null, [], findProfilerData)

  const [errorDialogOpen, setErrorDialogOpen] = useState(false)

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

        try {
          await createBooking.mutateAsync({ tripID, params: bookingData })
        } catch (error: any) {
          // Handle 500 error and show the dialog
          if (error?.response?.status === 500) {
            setErrorDialogOpen(true)
          } else {
            console.error('An error occurred while creating the booking:', error)
          }
        }
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
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        !R.isNil(trip) &&
        !R.isNil(profiler) && (
          <>
            <BookingForm
              trip={trip}
              profiler={profiler}
              seats={simplySeats()}
              totalPrice={totalPrice}
              onSubmit={onSubmit}
              isLoading={isUploadMediaLoading || isCreateBookingLoading}
            />
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
              <DialogTitle>Booking Error</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  A booking error occurred due to a possible double booking. Please change your seat and try again.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )
      )}
    </>
  )
}

Booking.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}
