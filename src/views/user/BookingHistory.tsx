// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// ** Types Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'

// import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import { Booking } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'
import { bookingStatusObj } from '../admin/BookingList'
import { CardContent, CardHeader, Grid } from '@mui/material';

interface Props {
  bookings: Booking[]
}

const BookingHistoryCards = (props: Props) => {
  const router = useRouter()
  const { bookings } = props

  return (
    <Grid container spacing={3}>
      {bookings.map((booking: Booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking._id}> {/* Responsive sizing */}
          <Card>
            <CardHeader
              title={booking.trip_data?.data?.title || "Trip Title Unavailable"}
              subheader={`จองในชื่อ: ${booking.data.seat_name}`}
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                     {format(new Date(booking.trip_data?.data?.from_date || 0), 'dd MMM yyyy')} -
                     {format(new Date(booking.trip_data?.data?.to_date || 0), 'dd MMM yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={booking.data.status}
                    color={bookingStatusObj[booking.data.status].color}
                    size="small"
                    sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box style={{ display: 'flex' }}>
                    <Button
                      variant='contained'
                      color='info'
                      style={{ color: 'white', marginRight: '0.5em' }}
                      onClick={() => router.push(`/trips/${booking.trip_id}`)}
                    >
                      ดูข้อมูลทริป
                    </Button>
                    <ViewSeatButton booking={booking} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const BookingHistoryTable = (props: Props) => {
  const router = useRouter()
  const { bookings } = props

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อทริป</TableCell>
              <TableCell>ชื่อที่นั่ง</TableCell>
              <TableCell>ที่นั่ง</TableCell>
              <TableCell>วันที่ไป</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>ACTIONs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row: Booking, index) => {
              return (
                <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell>{row.trip_data?.data?.title}</TableCell>
                  <TableCell>{row.data?.seat_name}</TableCell>
                  <TableCell>{row.data?.seat_number}</TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {`${format(new Date(row.trip_data?.data?.from_date || 0), 'dd MMM yyyy')}
                      -
                      ${format(new Date(row.trip_data?.data?.to_date || 0), 'dd MMM yyyy')}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.data.status}
                      color={bookingStatusObj[row.data.status].color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      <Button
                        variant='contained'
                        color='info'
                        style={{ color: 'white', marginRight: 20 }}
                        onClick={() => router.push(`/trips/${row.trip_id}`)}
                      >
                        ดูข้อมูลทริป
                      </Button>
                      <ViewSeatButton booking={row} />
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
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
              {`${transport?.data.name}, ที่นั่ง #${booking.data.seat_number}`}
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
