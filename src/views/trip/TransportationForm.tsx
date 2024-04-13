import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper
} from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Seat, SeatStatus } from 'src/@core/types/transport'

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} key={'1'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <SeatButton seat={values[0]} tripID={tripID} transportID={transportID} />
        </Paper>
      </Grid>
      <Grid item xs={8} key={'driver'}>
        <Paper
          style={{ height: 100, textAlign: 'center', lineHeight: '100px', backgroundColor: '#74B3CE', color: 'white' }}
        >
          คนขับ
        </Paper>
      </Grid>
      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(pos => {
        return (
          <Grid item xs={4} key={pos}>
            <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
              <SeatButton seat={values[pos - 1]} tripID={tripID} transportID={transportID} />
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

export function TransportationNormalBookingForm() {
  return <div />
}

interface SeatButtonProps {
  seat: Seat
  tripID: string
  transportID: string
}

function SeatButton(props: SeatButtonProps) {
  const router = useRouter()
  const { seat, tripID, transportID } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const bgColor = seat.is_lock ? 'error' : seat ? 'primary' : 'info'

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClickOpen}
        color={bgColor}
        disabled={seat.is_lock || seat.status != SeatStatus[SeatStatus.EMPTY]}
        style={
          seat.status === SeatStatus[SeatStatus.RESERVE] || seat.is_lock
            ? { height: '100%', width: '100%', boxShadow: 'none', backgroundColor: bgColor }
            : { boxShadow: 'none' }
        }
      >
        {showSeatText(seat)}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`จองที่นั่งที่ #${seat.seat_number}?`}</DialogTitle>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() =>
              router.push(`/trips/${tripID}/booking?transport_id=${transportID}&seat_number=${seat.seat_number}`)
            }
          >
            จองเลย
          </Button>
          <Button onClick={handleClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
