// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// ** Types Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'

// import { useRouter } from 'next/router'
import { CardHeader, Grid } from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import { Booking, PaymentType } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'
import { bookingStatusObj } from '../admin/BookingList'

import styles from './BookingCard.module.css'

interface Props {
  bookings: Booking[]
}

const BookingHistoryCards = (props: Props) => {
  const router = useRouter()
  const { bookings } = props

  return (
    <div className={styles.bookingTableContainer}>
      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => {
          const subheader = booking.data.seats.reduce((prev, curr, index) => {
            const format = `${curr.seat_name} `
            if (index === 0) {
              return format
            } else {
              return prev + ', ' + format
            }
          }, '')

          return (
            <Grid item xs={12} key={booking._id}>
              <Card className={styles.bookingCard}>
                <Grid container spacing={5} columns={12}>
                  <Grid item xs={6} sm={6} md={3}>
                    <CardHeader
                      title={booking.trip_data?.data?.title || 'Trip Title Unavailable'}
                      subheader={`จองในชื่อ: ${subheader}`}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={3}>
                    <Chip
                      label={`  ${format(new Date(booking.trip_data?.data?.from_date || 0), 'dd MMM yyyy')} >
                      ${format(new Date(booking.trip_data?.data?.to_date || 0), 'dd MMM yyyy')}`}
                      color='primary'
                      size='medium'
                      sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={2}>
                    <Box style={{ display: 'flex', marginLeft: 10 }}>
                      <Chip
                        label={booking.data.status}
                        color={bookingStatusObj[booking.data.status].color}
                        size='medium'
                        sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                      />
                      <Chip
                        label={booking.data.payment_type === PaymentType[PaymentType.FULL] ? 'แบบจ่ายเต็ม' : 'แบบมัดจำ'}
                        color='warning'
                        size='medium'
                        sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6} md={4}>
                    <Box style={{ display: 'flex' }}>
                      <Button
                        variant='outlined'
                        style={{ marginRight: '0.5em' }}
                        onClick={() => router.push(`/trips/${booking.trip_id}`)}
                      >
                        ดูข้อมูลทริป
                      </Button>
                      <ViewSeatButton booking={booking} />
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
  }, [open])

  const transports: Transport[] = R.pathOr<Transport[]>([], [], data)
  const transport = transports.filter(v => v._id === booking.data.transport_id)[0] || null

  const seat_numbers = booking.data.seats.reduce((prev, curr, index) => {
    const format = `#${curr.seat_number} `
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
              {`${transport?.data.name}, ที่นั่ง #${seat_numbers}`}
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
