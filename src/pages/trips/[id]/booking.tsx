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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toCurrency } from 'src/@core/utils/currency'

export const SlipImgStyled = styled('img')(({ theme }) => ({
  width: 'auto',
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

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  const totalPrice = trip?.data?.payment?.full_price
  const depositPrice = trip?.data?.payment?.deposit_price

  return (
    <ApexChartWrapper>
      <BasicLoadingComponent isLoading={R.isNil(trip) && R.isNil(profiler)} error={createBookingError}>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }}>
              ชำระเงิน
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {!R.isNil(totalPrice) && (
              <Card sx={{ marginBottom: '1em'}}>
                <CardContent>
                  <Typography variant='h6'>ราคาเต็ม: {toCurrency(totalPrice)}</Typography>
                  {depositPrice ? <Typography variant='body1'>ค่าจอง: {toCurrency(depositPrice)}</Typography> : ''}
                </CardContent>
              </Card>
            )}
            {!R.isNil(profiler) &&
              profiler?.data?.bank_accounts.map(v => {
                return (
                  <Card key={v?.account_number}>
                    <CardContent>
                      <Typography variant='h6'>บัญชีปลายทาง:</Typography>
                      <Typography variant='body1'>ธนาคาร: {v.bank_title}</Typography>
                      <Typography variant='body1'>เลขบัญชี: {v.account_number}</Typography>
                      <Typography variant='body1'>ชื่อ: {v.account_name}</Typography>
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
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <TextField
                          {...register('seat_name', { required: true })}
                          label='ใส่ชื่อจองของคุณ'
                          variant='outlined'
                          fullWidth
                          error={!R.isNil(errors.seat_name)}
                          helperText={errors.seat_name && errors.seat_name?.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid item xs={12} sx={{ paddingBottom: '0.5em' }}>
                          <Typography variant='h6'>หลักฐานการโอนเงิน:</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ paddingBottom: '0.5em' }}>
                          {!R.isNil(slipImage?.file) && (
                            <SlipImgStyled src={URL.createObjectURL(slipImage?.file)} alt='Profile Pic' />
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            component='label'
                            role={undefined}
                            variant='outlined'
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                          >
                            อัพโหลด bank slip
                            <VisuallyHiddenInput type='file' onChange={handleImageChange} />
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Button type='submit' variant='contained' color='primary'>
                          ดำเนินการจอง
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
