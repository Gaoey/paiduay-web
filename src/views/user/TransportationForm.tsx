import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useApi } from 'src/@core/services'
import { Seat, SeatStatus } from 'src/@core/types/transport'
import { UserProfile } from 'src/@core/types/user'
import { range } from '../admin/TransportationForm'
import { LoadingButton } from '@mui/lab'

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
          style={{ height: 100, textAlign: 'center', lineHeight: '100px', backgroundColor: '#74B3CE', color: 'white' }}
        >
          คนขับ
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

  const bgColor = seat.is_lock ? 'error' : isHasSeat ? 'success' : 'primary'

  return (
    <Button
      variant='contained'
      color={bgColor}
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
  const { userAPI } = useApi()
  const { user, updateProfile } = userAPI

  const { data: userData } = user
  const { isLoading, isSuccess } = updateProfile
  useEffect(() => {
    user.mutate()
  }, [])

  const hasUserData = !R.isNil(userData?.profile) && !R.isEmpty(userData?.profile.line_contacts)

  const { seats, tripID, transportID } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const defaultValues = {
    first_name: '',
    last_name: '',
    telephone_number: '',
    line_contacts: ''
  }

  const { register, handleSubmit } = useForm<UserProfile>({ defaultValues })

  const onSubmit: SubmitHandler<any> = data => {
    const profile: UserProfile = {
      ...userData?.profile,
      ...data
    }
    updateProfile.mutate(profile)
  }

  const linkto = useCallback(() => {
    const query = seats.reduce((prev, curr) => {
      return `${prev}&seat_number=${curr.seat_number}`
    }, '')
    console.log({ seats })
    router.push(`/trips/${tripID}/booking?transport_id=${transportID}&${query}`)
  }, [])

  useEffect(() => {
    if (isSuccess) {
      linkto()
    }
  }, [isSuccess, linkto])

  return (
    <>
      <Button variant='contained' onClick={handleClickOpen} color='info' disabled={seats.length === 0}>
        จองเลย
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{hasUserData ? `ยืนยันการจองใช่ใหม?` : 'เพิ่มข้อมูลส่วนตัว'}</DialogTitle>
        {!hasUserData ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                <DialogContentText sx={{ marginBottom: 10 }}>
                  โปรดใส่ข้อมูลส่วนตัวเพื่อให้เจ้าของทริปติดต่อคุณได้ง่ายขึ้น
                </DialogContentText>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField label='First Name' fullWidth {...register('first_name')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label='Last Name' fullWidth {...register('last_name')} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField label='Telephone Number' fullWidth {...register('telephone_number')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label='Line ID' fullWidth {...register('line_contacts')} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <LoadingButton variant='contained' type='submit' loading={isLoading}>
                  SUBMIT
                </LoadingButton>
                <Button onClick={handleClose}>ปิด</Button>
              </DialogActions>
            </form>
          </>
        ) : (
          <DialogActions>
            <Button variant='contained' onClick={() => linkto()}>
              จองเลย
            </Button>
            <Button onClick={handleClose}>ปิด</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}
