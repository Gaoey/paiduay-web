import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled
} from '@mui/material'
import * as R from 'ramda'
import { useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Booking, PaymentType, SimplySeatData } from 'src/@core/types/booking'
import { Profiler } from 'src/@core/types/profiler'
import { PaymentData, Trip } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'

export const SlipImgStyled = styled('img')(({ theme }) => ({
  width: 'auto',
  height: 200,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

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

export function getPaymentPrice(paymentData: PaymentData, total_seats: number, paymentType: string): number {
  if (paymentType === PaymentType[PaymentType.DEPOSIT]) {
    return total_seats * (paymentData?.deposit_price || paymentData.full_price)
  }

  return total_seats * paymentData.full_price
}

interface BookingFormProps {
  trip: Trip
  profiler: Profiler
  booking?: Booking
  seats: SimplySeatData[]
  totalPrice: number
  onSubmit: SubmitHandler<any>
  isDeposit?: boolean
  isLoading: boolean
}

export default function BookingForm(props: BookingFormProps) {
  const { trip, profiler, seats, totalPrice, booking, onSubmit, isDeposit = false, isLoading = false } = props
  const defaultValues = {
    seats: seats,
    payment_type: PaymentType[PaymentType.FULL] as string,
    slip_image: booking?.data.slips || []
  }

  const { register, handleSubmit, setValue, watch, control } = useForm({ defaultValues })

  const { fields: seatFields } = useFieldArray({
    control,
    name: 'seats'
  })

  const [slipImage, setSlipImage] = useState<Media | null>(null)

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
      setValue('slip_image', [slipMedia])
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {!R.isNil(totalPrice) && (
          <Card sx={{ marginBottom: '1em', padding: 10, height: '100%' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4' gutterBottom>
                    การชำระเงิน
                  </Typography>
                  <Typography gutterBottom variant='caption'>
                    * การชำระเงินสามารถเลือกได้สองรูปแบบ คุณสามารถเลือกประเภทการจ่ายเงินได้
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {!R.isNil(trip) && (
                    <PaymentTypeRadioGroup
                      trip={trip}
                      onChange={t => setValue('payment_type', t)}
                      isDeposit={isDeposit}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ padding: 5 }}>
                {!R.isNil(trip?.data?.payment) && (
                  <>
                    <Typography gutterBottom>Total</Typography>
                    <Typography gutterBottom variant='h4' sx={{ color: 'grey' }}>
                      {isDeposit
                        ? toCurrency(trip?.data?.payment.full_price - (booking?.data.payment_price || 0.0))
                        : toCurrency(getPaymentPrice(trip?.data?.payment, seats.length, watch('payment_type')))}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sx={{ padding: 5 }}>
                <Typography variant='h6'>Bank Account</Typography>
                <Typography gutterBottom variant='caption'>
                  * เลือกบัญชีธนาคารพร้อมอัพโหลดสลิปเพื่อยืนยัน
                </Typography>
                <Divider />
                {!R.isNil(profiler) &&
                  profiler?.data?.bank_accounts.map(v => {
                    return (
                      <Box key={v.bank_title}>
                        <>
                          <List disablePadding>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemText sx={{ mr: 2 }} primary={'บัญชีธนาคาร'} secondary={''} />
                              <Typography variant='body1' fontWeight='medium' color='grey'>
                                {v.bank_title}
                              </Typography>
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemText sx={{ mr: 2 }} primary={'เลขบัญชี'} secondary={''} />
                              <Typography variant='body1' fontWeight='medium' color='grey'>
                                {v.account_number}
                              </Typography>
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemText sx={{ mr: 2 }} primary={'ชื่อบัญชี'} secondary={''} />
                              <Typography variant='body1' fontWeight='medium' color='grey'>
                                {v.account_name}
                              </Typography>
                            </ListItem>
                          </List>
                        </>
                        <Divider />
                      </Box>
                    )
                  })}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Card sx={{ marginBottom: '1em', padding: 10, height: '100%', textAlign: 'center' }}>
          <Typography variant='h6'>กรอกข้อมูลที่นั่ง</Typography>
          <Typography gutterBottom variant='caption'>
            * โปรดใส่ชื่อที่นั่งของคุณก่อนอัพโหลดสลิป
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  {seatFields.map((item, index) => {
                    return (
                      <Box key={item.id} sx={{ margin: 5 }}>
                        <TextField
                          {...register(`seats.${index}.seat_name`, { required: 'ต้องมีชื่อที่นั่ง' })}
                          label={`ใส่ชื่อจองที่นั่ง #${item.seat_number} ของคุณ`}
                          defaultValue={item.seat_name}
                          disabled={isDeposit}
                        />
                      </Box>
                    )
                  })}
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12} sx={{ paddingBottom: '0.5em', paddingTop: '2em' }}>
                    <Typography variant='h6'>หลักฐานการโอนเงิน</Typography>
                    <Typography gutterBottom variant='caption'>
                      * สลิปของคุณจะถูกส่งให้กับเจ้าของทริป โปรดใส่ข้อมูลให้ถูกต้องก่อนอัพโหลด
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ paddingBottom: '0.5em' }}>
                    {!R.isNil(slipImage?.file) && (
                      <SlipImgStyled src={URL.createObjectURL(slipImage?.file as File)} alt='Profile Pic' />
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
                      อัพโหลดสลิปธนาคาร
                      <VisuallyHiddenInput type='file' onChange={handleImageChange} />
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 30 }}>
                  <LoadingButton type='submit' variant='contained' color='primary' loading={isLoading}>
                    ดำเนินการจ่ายเงิน
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

interface PaymentTypeRadioGroup {
  trip: Trip
  onChange: (paymentType: string) => void
  isDeposit: boolean
}

export function PaymentTypeRadioGroup(props: PaymentTypeRadioGroup) {
  const { trip, onChange, isDeposit } = props

  const [value, setValue] = useState<string>(PaymentType[PaymentType.FULL])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setValue(value)
    onChange(value)
  }

  return (
    <FormControl>
      {/* <FormLabel id='payment-type-label'>ประเภทการจ่าย</FormLabel> */}
      <RadioGroup
        row
        aria-labelledby='row-radio-buttons-group-label'
        name='row-radio-buttons-group'
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value={PaymentType[PaymentType.FULL]} control={<Radio />} label='จ่ายเต็มจำนวน' />
        <FormControlLabel
          value={PaymentType[PaymentType.DEPOSIT]}
          control={<Radio />}
          label='จ่ายแบบมัดจำ'
          disabled={(trip.data.payment?.deposit_price || 0.0) === 0.0 || isDeposit}
        />
      </RadioGroup>
    </FormControl>
  )
}
