// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// ** Types Imports
import {
  Button,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material'

// import { useRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ImageCarousel from 'src/@core/components/image-carousel'
import { ThemeColor } from 'src/@core/layouts/types'
import { Media } from 'src/@core/types'
import { Booking, BookingData, BookingStatus, SimplySeatData } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'
import { useFieldArray, useForm } from 'react-hook-form'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
    label: string
  }
}

export const bookingStatusObj: StatusObj = {
  [BookingStatus[BookingStatus.CONFIRM]]: { color: 'success', label: 'สำเร็จ' },
  [BookingStatus[BookingStatus.DEPOSIT]]: { color: 'warning', label: 'มัดจำอยู่' },
  [BookingStatus[BookingStatus.PENDING]]: { color: 'primary', label: 'รอการตรวจสอบ' },
  [BookingStatus[BookingStatus.NONE]]: { color: 'error', label: 'มีปัญหา' },
  [BookingStatus[BookingStatus.REJECT]]: { color: 'error', label: 'ถูกปฎิเสธ' }
}

interface Props {
  bookings: Booking[]
  transports: Transport[]
  onUpdateBooking: (bookingID: string, params: BookingData) => void
}

const BookingCards = ({ bookings, transports, onUpdateBooking }: Props) => {
  const router = useRouter()

  return (
    <Grid container spacing={3}>
      {bookings.map(booking => {
        const transport = transports.find(t => t._id === booking.data.transport_id)
        const subheader = booking.data.seats.reduce((prev, curr, index) => {
          const format = `#${curr.seat_number} ${curr.seat_name} `
          if (index === 0) {
            return format
          } else {
            return prev + ', ' + format
          }
        }, '')

        return (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card>
              <CardHeader title={subheader} subheader={transport?.data.name || 'Transport Info Unavailable'} />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Chip
                      label={bookingStatusObj[booking.data.status].label}
                      color={bookingStatusObj[booking.data.status].color}
                      size='small'
                      sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      <ViewSlipButton slipImg={booking.data.slips} />
                      <Button
                        variant='contained'
                        color='success'
                        style={{ color: 'white', marginRight: '0.5em' }}
                        onClick={() => router.push(`/user/${booking.data.user_id}`)}
                      >
                        View User
                      </Button>
                      <UpdateStatusButton
                        bookingID={booking._id}
                        onChange={(id, status) => {
                          const newBookingData: BookingData = {
                            ...booking.data,
                            status
                          }
                          onUpdateBooking(id, newBookingData)
                        }}
                      />
                      <ChangeBookingNameButton
                        booking={booking}
                        onChange={(id, seats) => {
                          const newBookingData: BookingData = {
                            ...booking.data,
                            seats: seats
                          }
                          onUpdateBooking(id, newBookingData)
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

interface UpdateStatusButtonProps {
  bookingID: string
  onChange: (bookingID: string, status: BookingStatus | string) => void
}

function UpdateStatusButton(props: UpdateStatusButtonProps) {
  const { bookingID, onChange } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        onClick={handleClickOpen}
        style={{ color: 'white', marginRight: 20 }}
      >
        เปลี่ยนสถานะ
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ต้องการจะคอนเฟิร์มเงินโอนไหม?`}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.CONFIRM]
              onChange(bookingID, status)
              handleClose()
            }}
            variant='contained'
            color='secondary'
          >
            คอนเฟิร์ม
          </Button>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.PENDING]
              onChange(bookingID, status)
              handleClose()
            }}
            variant='contained'
            color='primary'
          >
            รอรับเงินอยู่
          </Button>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.REJECT]
              onChange(bookingID, status)
              handleClose()
            }}
            variant='contained'
            color='error'
          >
            ปฏิเสธการรับเงิน
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface ViewSlipButtonProps {
  slipImg: Media[]
}

function ViewSlipButton(props: ViewSlipButtonProps) {
  const { slipImg } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant='contained' onClick={handleClickOpen} style={{ color: 'white', marginRight: 20 }}>
        ดูสลิป
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>สลิป</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText>
            <ImageCarousel medias={slipImg} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
interface ChangeBookingNameButtonProps {
  booking: Booking
  onChange: (bookingID: string, seats: SimplySeatData[]) => void
}

function ChangeBookingNameButton(props: ChangeBookingNameButtonProps) {
  const { booking, onChange } = props

  const title = booking.data.seats.reduce((prev, curr, index) => {
    const format = `${curr.seat_name} `
    if (index === 0) {
      return format
    } else {
      return prev + ', ' + format
    }
  }, '')

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const defaultValues = {
    seats: booking.data.seats
  }

  const { register, handleSubmit, control } = useForm({ defaultValues })

  const handleSubmitChangeName = handleSubmit(data => {
    onChange(booking._id, data.seats)
    handleClose()
  })

  const { fields } = useFieldArray({
    control,
    name: 'seats'
  })

  return (
    <>
      <Button variant='outlined' color='secondary' onClick={handleClickOpen} style={{ marginRight: 20 }}>
        เปลี่ยนชื่อผู้จอง
      </Button>
      <form onSubmit={handleSubmitChangeName}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{`ต้องการเปลี่ยนชื่อของ "${title}" หรือไม่?`}</DialogTitle>
          <DialogContent>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ padding: 2 }}>
                <TextField
                  {...register(`seats.${index}.seat_name`)}
                  label={`ขื่อผู้จอง #${index}`}
                  defaultValue={item.seat_name}
                />
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button type='submit' variant='contained' color='secondary'>
              คอนเฟิร์ม
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  )
}

export default BookingCards
