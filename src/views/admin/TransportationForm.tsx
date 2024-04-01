import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { Seat, SeatStatus, Transportation } from 'src/@core/types/transport'

export function range(start: number, end: number, step = 1): number[] {
  const array = []
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    array.push(i)
  }

  return array
}

export const getDefaultTransport = (totalSeats: number, defaultName: string, transport_by: Transportation) => {
  const seats = range(1, totalSeats).map(numb => {
    return {
      name: `#${numb}`,
      seat_number: numb,
      user_id: null,
      is_lock: false,
      status: SeatStatus[SeatStatus.EMPTY]
    }
  })

  return {
    name: defaultName,
    total_seats: totalSeats,
    transport_by: Transportation[transport_by],
    seats
  }
}

interface VanFormProps {
  values: Seat[]
  onChange?: (seats: Seat[]) => void
}

export function VanForm(props: VanFormProps) {
  const { values, onChange = () => null } = props

  const onChangeSeats = (seat: Seat) => {
    const res = values.map(v => {
      if (v.seat_number === seat.seat_number) {
        return {
          ...v,
          ...seat
        }
      }

      return v
    })

    onChange(res)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} key={'1'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <SeatButton seat={values[0]} onChange={s => onChangeSeats(s)} />
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
              <SeatButton seat={values[pos - 1]} onChange={s => onChangeSeats(s)} />
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

export function TransportationNormalForm() {
  return <div />
}

interface SeatButtonProps {
  seat: Seat
  onChange: (seat: Seat) => void
}

function SeatButton(props: SeatButtonProps) {
  const { seat, onChange } = props

  const [open, setOpen] = useState(false)
  const [seatName, setSeatName] = useState<string>(seat.name || '')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const regexPattern = /^#\d+$/
  const isDefaultName = regexPattern.test(seat.name || '#1')

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClickOpen}
        color={seat.is_lock ? 'error' : isDefaultName ? 'primary' : 'info'}
      >
        {showSeatText(seat)}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Update seat #${seat.seat_number}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={2}>
              <Grid item md={12}>
                {!isDefaultName && (
                  <Typography variant='subtitle2' sx={{ mt: 1 }} color='red'>
                    {`Warning!! Do you want to update this seat, it was reserved by "${seat.name}"`}
                  </Typography>
                )}
              </Grid>
              <Grid item md={12}>
                <TextField label='Update seat name' onChange={v => setSeatName(v.target.value)} fullWidth />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              onChange({ ...seat, is_lock: !seat.is_lock })
              handleClose()
            }}
          >
            {seat.is_lock ? 'UNLOCK' : 'LOCK'}
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onChange({ ...seat, name: seatName, status: SeatStatus[SeatStatus.RESERVE] })
              handleClose()
            }}
          >
            Confirm
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              onChange({ ...seat, name: `#${seat.seat_number}`, status: SeatStatus[SeatStatus.EMPTY] })
              handleClose()
            }}
          >
            Empty Seat
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export function showSeatText(seat: Seat): string {
  const regexPattern = /^#\d+$/
  if (seat.is_lock) {
    return 'LOCK'
  } else if (!regexPattern.test(seat.name || '#1')) {
    return `(${seat.seat_number}) ${seat.name}`
  } else {
    return `#${seat.seat_number}`
  }
}
