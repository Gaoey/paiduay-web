// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// ** Types Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'

// import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import { Booking, BookingStatus, PaymentType } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'
import { bookingStatusObj } from '../admin/BookingList'

import styles from './BookingCard.module.css'

interface Props {
  bookings: Booking[]
}

const BookingHistoryCards = (props: Props) => {
  const router = useRouter()
  const { bookings } = props
  const currentDate = new Date().getTime()

  return (
    <div className={styles.bookingTableContainer}>
      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => {
          const dateString = booking?.trip_data?.data?.to_date
          const bookingLastDate = new Date(dateString as Date).getTime()
          const datePassed = currentDate > bookingLastDate
          const opacity = datePassed ? 0.35 : 1

          return (
            <Grid item xs={12} key={booking._id}>
              <Card className={styles.bookingCard}>
                <Grid container spacing={5} columns={12} sx={{ opacity }}>
                  <Grid item xs={12} sm={6} md={3} sx={{ marginLeft: '0.2em' }}>
                    <Typography variant='body1' color='text.primary' style={{ fontWeight: 'bold' }}>
                      {booking.trip_data?.data?.title || 'Trip Title Unavailable'}
                    </Typography>
                    <Typography variant='body2' color='text.subtitle' style={{}}>
                      {`สร้างทริป: ${format(new Date(booking.created_at || 0), 'dd MMM yyyy')}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} sm={6} md={3}>
                    <Chip
                      label={`${format(new Date(booking.trip_data?.data?.from_date || 0), 'dd MMM yy')} -
                      ${format(new Date(booking.trip_data?.data?.to_date || 0), 'dd MMM yy')}`}
                      color={'info'}
                      size='medium'
                      sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                    />
                  </Grid>
                  <Grid item xs={5} sm={6} md={2}>
                    <Box style={{ display: 'flex' }}>
                      <Chip
                        label={bookingStatusObj[booking.data.status].label}
                        color={bookingStatusObj[booking.data.status].color}
                        size='medium'
                        sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Box style={{ display: 'flex' }}>
                      <Button
                        variant='outlined'
                        style={{ marginRight: '1em' }}
                        onClick={() => router.push(`/trips/${booking.trip_id}?hideElement=true`)}
                      >
                        ดูข้อมูลทริป
                      </Button>
                      <ViewSeatButton booking={booking} />
                      {booking.data.payment_type === PaymentType[PaymentType.DEPOSIT] &&
                        booking.data.status !== BookingStatus[BookingStatus.REJECT] && (
                          <Button
                            variant='contained'
                            style={{ marginRight: '1em' }}
                            color='warning'
                            onClick={() => router.push(`/trips/${booking.trip_id}/booking/${booking._id}`)}
                          >
                            จ่ายเต็ม
                          </Button>
                        )}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

interface ViewSeatButtonProps {
  booking: Booking
}

function ViewSeatButton(props: ViewSeatButtonProps) {
  const { transportAPI } = useApi()
  const { booking } = props

  const { findTransportByTripID } = transportAPI
  const { data } = findTransportByTripID
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (open && R.isNil(data)) {
      findTransportByTripID.mutate(booking.trip_id)
    }
  }, [])

  const transports: Transport[] = R.pathOr<Transport[]>([], [], data)
  const transport = transports.filter(v => v._id === booking.data.transport_id)[0] || null

  const seat_numbers = booking.data.seats.reduce((prev, curr, index) => {
    const format = `${curr.seat_name} (#${curr.seat_number})`
    if (index === 0) {
      return format
    } else {
      return prev + ', ' + format
    }
  }, '')

  return (
    <>
      <Button variant='contained' onClick={handleClickOpen} style={{ color: 'white', marginRight: 20 }}>
        ดูคันรถ
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>รถคุณคือ</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText>
            <Typography variant='body2' color='text.secondary'>
              {`รถชื่อ "${transport?.data.name}", ที่นั่ง ${seat_numbers}`}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingHistoryCards
