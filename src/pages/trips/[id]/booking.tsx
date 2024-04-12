import { Button, Card, CardContent, Grid, TextField, Typography, styled } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicLoadingComponent } from 'src/@core/components/loading'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { BookingData, BookingStatus } from 'src/@core/types/booking'
import { Profiler } from 'src/@core/types/profiler'
import { Trip } from 'src/@core/types/trip'
import UserLayout from 'src/layouts/UserLayout'

export const SlipImgStyled = styled('img')(({ theme }) => ({
  width: 200,
  height: 200,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))
export default function Booking() {
  const router = useRouter()

  const tripID = router.query.id as string
  const transport_id = router.query.transport_id as string
  const str_seat_number = router.query.seat_number as string
  const seat_number = Number(str_seat_number)

  const { tripAPI, profilerAPI, bookingAPI, userAPI, mediaAPI } = useApi()
  const { uploadMedias } = mediaAPI
  const { user } = userAPI
  const { findTripByID } = tripAPI
  const { findProfilerByTripID } = profilerAPI
  const { createBooking } = bookingAPI

  const { data: userData } = user
  const { data: findTripData } = findTripByID
  const { data: findProfilerData } = findProfilerByTripID
  const { error: createBookingError, isSuccess } = createBooking
  const trip = R.pathOr<Trip | null>(null, [], findTripData)
  const profiler = R.pathOr<Profiler | null>(null, [], findProfilerData)

  useEffect(() => {
    user.mutate()
    findTripByID.mutate(tripID)
    findProfilerByTripID.mutate(tripID)
  }, [])

  const [slipImage, setSlipImage] = useState<Media | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const target: File = e.target.files[0]
      const slipMedia: Media = {
        bucket_name: BUCKET_NAME,
        name: target.name,
        uri: '',
        signed_url: '',
        type: target.type,
        file: target
      }
      setSlipImage(slipMedia)
    }
  }

  const onSubmit: SubmitHandler<any> = async data => {
    if (!R.isNil(slipImage) && !R.isNil(userData?._id)) {
      const newMedias: Media[] = await uploadMedias.mutateAsync([slipImage])
      const bookingData: BookingData = {
        user_id: userData._id,
        transport_id: transport_id,
        seat_name: data?.seat_name || `#${seat_number}`,
        seat_number: seat_number,
        status: BookingStatus[BookingStatus.PENDING],
        slips: [newMedias[0]]
      }

      createBooking.mutate({ tripID, params: bookingData })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/trips/${tripID}/booking/success`)
    }
  }, [isSuccess, router, tripID])

  return (
    <ApexChartWrapper>
      <BasicLoadingComponent isLoading={R.isNil(trip) && R.isNil(profiler)} error={createBookingError}>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Payment
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {!R.isNil(profiler) &&
              profiler?.data?.bank_accounts.map(v => {
                return (
                  <Card key={v?.account_number}>
                    <CardContent>
                      <Typography variant='h6'>Bank Account Details:</Typography>
                      <Typography variant='body1'>Bank Name: {v.bank_title}</Typography>
                      <Typography variant='body1'>Account Number: {v.account_number}</Typography>
                      <Typography variant='body1'>Account Name: {v.account_name}</Typography>
                    </CardContent>
                  </Card>
                )
              })}
          </Grid>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Grid container spacing={7}>
                      <Grid item xs={12}>
                        <TextField
                          {...register('seat_name', { required: true })}
                          label='Your seat name'
                          variant='outlined'
                          fullWidth
                          error={!R.isNil(errors.seat_name)}
                          helperText={errors.seat_name && errors.seat_name?.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid item xs={12}>
                          <Typography variant='h6'>Upload Payment Slip:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          {!R.isNil(slipImage?.file) && (
                            <SlipImgStyled src={URL.createObjectURL(slipImage?.file)} alt='Profile Pic' />
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            {...register('slip_image')}
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Button type='submit' variant='contained' color='primary'>
                          Submit Payment
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </BasicLoadingComponent>
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
