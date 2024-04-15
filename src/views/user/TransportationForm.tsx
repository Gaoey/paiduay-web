import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, Paper } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Seat, SeatStatus } from 'src/@core/types/transport'
import { range } from '../admin/TransportationForm'

interface VanBookingForm {
  values: Seat[]
  tripID: string
  transportID: string
}

export function showSeatText(seat: Seat): string {
  if (seat.is_lock) {
    return 'LOCK'
  } else if (seat.status !== SeatStatus[SeatStatus.EMPTY]) {
    return 'RESERVE'
  } else {
    return `#${seat.seat_number}`
  }
}

export function VanBookingForm(props: VanBookingForm) {
  const { values, tripID, transportID } = props
  const [seats, setSeats] = useState<Seat[]>([])

  const onSetSeat = (seats: Seat[], seat: Seat) => {
    const isHasSeat = seats.filter(v => seat.seat_number === v.seat_number).length > 0
    if (isHasSeat) {
      const newSeats: Seat[] = seats.filter(v => seat.seat_number !== v.seat_number)
      setSeats(newSeats)
    } else {
      const newSeats = [...seats, seat]
      setSeats(newSeats)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} key={'1'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <SeatButton seat={values[0]} seats={seats} onSetSeat={(seat: Seat) => onSetSeat(seats, seat)} />
        </Paper>
      </Grid>
      <Grid item xs={8} key={'driver'}>
        <Paper
          style={{ height: 100, textAlign: 'center', lineHeight: '100px', backgroundColor: 'grey', color: 'white' }}
        >
          DRIVER
        </Paper>
      </Grid>
      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(pos => {
        return (
          <Grid item xs={4} key={pos}>
            <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
              <SeatButton seat={values[pos - 1]} seats={seats} onSetSeat={(seat: Seat) => onSetSeat(seats, seat)} />
            </Paper>
          </Grid>
        )
      })}
      <Grid item xs={12}>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <ConfirmSeatButton seats={seats} tripID={tripID} transportID={transportID} />
        </Box>
      </Grid>
    </Grid>
  )
}

interface TransportationNormalBookingFormProps {
  values: Seat[]
  tripID: string
  transportID: string
}

export function TransportationNormalBookingForm(props: TransportationNormalBookingFormProps) {
  const { values, tripID, transportID } = props
  const [seats, setSeats] = useState<Seat[]>([])

  const onSetSeat = (seats: Seat[], seat: Seat) => {
    const isHasSeat = seats.filter(v => seat.seat_number === v.seat_number).length > 0
    if (isHasSeat) {
      const newSeats: Seat[] = seats.filter(v => seat.seat_number !== v.seat_number)
      setSeats(newSeats)
    } else {
      const newSeats = [...seats, seat]
      setSeats(newSeats)
    }
  }

  return (
    <Grid container spacing={2}>
      {range(1, values.length).map(pos => {
        return (
          <Grid item xs={4} key={pos}>
            <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
              <SeatButton seat={values[pos - 1]} seats={seats} onSetSeat={(seat: Seat) => onSetSeat(seats, seat)} />
            </Paper>
          </Grid>
        )
      })}
      <Grid item xs={12}>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <ConfirmSeatButton seats={seats} tripID={tripID} transportID={transportID} />
        </Box>
      </Grid>
    </Grid>
  )
}

interface SeatButtonProps {
  seat: Seat
  seats: Seat[]
  onSetSeat: (seat: Seat) => void
}

function SeatButton(props: SeatButtonProps) {
  const { seat, seats, onSetSeat } = props
  const isHasSeat = seats.filter(v => seat.seat_number === v.seat_number).length > 0

  return (
    <Button
      variant='contained'
      color={seat.is_lock ? 'error' : isHasSeat ? 'success' : 'primary'}
      disabled={seat.is_lock || seat.status != SeatStatus[SeatStatus.EMPTY]}
      onClick={() => onSetSeat(seat)}
    >
      {showSeatText(seat)}
    </Button>
  )
}

interface ConfirmSeatButtonProps {
  seats: Seat[]
  tripID: string
  transportID: string
}

function ConfirmSeatButton(props: ConfirmSeatButtonProps) {
  const router = useRouter()
  const { seats, tripID, transportID } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const query = seats.reduce((prev, curr) => {
    return `${prev}&seat_number=${curr.seat_number}`
  }, '')

  return (
    <>
      <Button variant='contained' onClick={handleClickOpen} color='info'>
        จองเลย
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ยืนยันการจองใช่ใหม?`}</DialogTitle>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => router.push(`/trips/${tripID}/booking?transport_id=${transportID}&${query}`)}
          >
            Confirm
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
