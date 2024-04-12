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
import { Booking, BookingData, BookingStatus } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

export const bookingStatusObj: StatusObj = {
  [BookingStatus[BookingStatus.CONFIRM]]: { color: 'success' },
  [BookingStatus[BookingStatus.PENDING]]: { color: 'primary' },
  [BookingStatus[BookingStatus.NONE]]: { color: 'error' },
  [BookingStatus[BookingStatus.REJECT]]: { color: 'error' }
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

        return (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card>
              <CardHeader
                title={transport?.data.name || 'Transport Info Unavailable'}
                subheader={`Seat: ${booking.data.seat_name} - ${booking.data.seat_number}`}
              />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Chip
                      label={booking.data.status}
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
                        onChange={(id, name) => {
                          const newBookingData: BookingData = {
                            ...booking.data,
                            seat_name: name
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
  onChange: (bookingID: string, name: string) => void
}

function ChangeBookingNameButton(props: ChangeBookingNameButtonProps) {
  const { booking, onChange } = props

  const [name, setName] = useState(booking.data.seat_name)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant='outlined' color='secondary' onClick={handleClickOpen} style={{ marginRight: 20 }}>
        เปลี่ยนชื่อผู้จอง
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ต้องการเปลี่ยนชื่อของ "${booking.data.seat_name}" หรือไม่?`}</DialogTitle>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            <TextField
              fullWidth
              label='ชื่อผู้จอง'
              defaultValue={booking.data.seat_name}
              onChange={e => setName(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onChange(booking._id, name)
              handleClose()
            }}
            variant='contained'
            color='secondary'
          >
            คอนเฟิร์ม
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingCards
