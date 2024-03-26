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
      <Grid item xs={4} key={'2'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(2)}
            color={values[1].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[1].is_lock ? 'LOCK' : '#2'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'3'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(3)}
            color={values[2].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[2].is_lock ? 'LOCK' : '#3'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'4'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(4)}
            color={values[3].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[3].is_lock ? 'LOCK' : '#4'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'5'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          {' '}
          <Button
            variant='contained'
            onClick={() => handleLock(5)}
            color={values[4].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[4].is_lock ? 'LOCK' : '#5'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'6'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(6)}
            color={values[5].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[5].is_lock ? 'LOCK' : '#6'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'7'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(7)}
            color={values[6].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[6].is_lock ? 'LOCK' : '#7'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'8'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          {' '}
          <Button
            variant='contained'
            onClick={() => handleLock(8)}
            color={values[7].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[7].is_lock ? 'LOCK' : '#8'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'9'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(9)}
            color={values[8].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[8].is_lock ? 'LOCK' : '#9'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'10'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button
            variant='contained'
            onClick={() => handleLock(10)}
            color={values[9].is_lock ? 'error' : 'primary'}
            disabled={isShow}
          >
            {values[9].is_lock ? 'LOCK' : '#10'}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  )
}

export function TransportationNormalForm() {
  return <div />
}
