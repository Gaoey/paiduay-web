import { Button, Grid, Paper } from '@mui/material'
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
  onChange?: (data: Seat[]) => void
  isShow?: boolean
}

export function VanForm(props: VanFormProps) {
  const { values, onChange = () => null, isShow = false } = props

  const handleLock = (seatNumber: number) => {
    const res = values.map(v => {
      if (v.seat_number === seatNumber) {
        return {
          ...v,
          is_lock: !v.is_lock
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
          <Button
            variant='contained'
            onClick={() => handleLock(1)}
            color={values[0].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[0].is_lock ? 'LOCK' : '#1'}
          </Button>
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
              <Button
                variant='contained'
                onClick={() => handleLock(pos)}
                color={values[pos - 1].is_lock ? 'error' : 'primary'}
                disabled={isShow}
              >
                {values[pos - 1].is_lock ? 'LOCK' : `#${pos}`}
              </Button>
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
