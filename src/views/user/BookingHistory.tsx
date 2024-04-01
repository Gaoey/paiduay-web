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
  Grid,
  Typography
} from '@mui/material'

// import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { useState } from 'react'
import { Booking } from 'src/@core/types/booking'
import { bookingStatusObj } from '../admin/BookingList'

interface Props {
  bookings: Booking[]
}

const BookingHistoryTable = (props: Props) => {
  // const router = useRouter()
  const { bookings } = props

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อทริป</TableCell>
              <TableCell>วันที่</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>ACTIONs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row: Booking, index) => {
              return (
                <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell>{row.trip_data?.title}</TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      Date: ({format(new Date(row.trip_data?.from_date || 0), 'dd MMM yyyy')} -
                      {format(new Date(row.trip_data?.to_date || 0), 'dd MMM yyyy')})
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
  const { booking } = props

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
        ดูที่นั่ง
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ที่นั่งคุณอยู่ที่</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText>
            <Grid container spacing={2}>
              <Typography variant='body2' color='text.secondary'>
                {`${booking.data.transport_id}, ที่นั่ง #${booking.data.seat_number}`}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingHistoryTable
