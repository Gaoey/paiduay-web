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
import EventSeat from '@mui/icons-material/EventSeat'

import { useState, useEffect, useCallback } from 'react'
import { Seat, SeatStatus, TransportData, Transportation } from 'src/@core/types/transport'

export function range(start: number, end: number, step = 1): number[] {
  const array = []
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    array.push(i)
  }

  return array
}

export const getDefaultTransport = (
  totalSeats: number,
  defaultName: string,
  transport_by: Transportation
): TransportData => {
  const seats: Seat[] = range(1, totalSeats).map(numb => {
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
          style={{ height: 100, textAlign: 'center', lineHeight: '100px', backgroundColor: '#74B3CE', color: 'white' }}
        >
          คนขับ
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

interface TransportationNormalFormProps {
  values: Seat[]
  onChange?: (seats: Seat[]) => void
  totalSeats: number
}

export function TransportationNormalForm(props: TransportationNormalFormProps) {
  const { values, onChange = () => null, totalSeats } = props

  const additionalSeats = totalSeats - values.length

  const newSeats =
    additionalSeats < 0
      ? values.slice(0, totalSeats)
      : Array.from({ length: additionalSeats }, (_, index) => ({
          name: `#${index + values.length + 1}`,
          seat_number: index + values.length + 1,
          user_id: null,
          is_lock: false,
          status: 'EMPTY'
        }))

  const totalSeatsData = totalSeats > values.length - 1 ? [...values, ...newSeats] : newSeats

  const onChangeSeats = (seat: Seat) => {
    const res = totalSeatsData.map(v => {
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

  useEffect(() => {
    if (totalSeats !== values.length) {
      onChangeSeats({} as Seat)
    }
  }, [totalSeats])

  return (
    <Grid container spacing={2}>
      {range(1, totalSeatsData.length).map(pos => {
        return (
          <Grid item xs={4} key={pos}>
            <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
              <SeatButton seat={totalSeatsData[pos - 1]} onChange={s => onChangeSeats(s)} />
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

interface SeatButtonProps {
  seat: Seat
  onChange: (seat: Seat) => void
}

function SeatButton(props: SeatButtonProps) {
  const { seat, onChange } = props
  const [open, setOpen] = useState(false)
  const [reserveFormLocalStatus, setReserveFormLocalStatus] = useState<string>('EMPTY')

  useEffect(() => {
    if (seat.is_lock) {
      setReserveFormLocalStatus('LOCKED')
    } else if (seat.status === SeatStatus[SeatStatus.RESERVE]) {
      setReserveFormLocalStatus('RESERVE')
    } else if (seat.status === SeatStatus[SeatStatus.PENDING]) {
      setReserveFormLocalStatus('PENDING')
    } else {
      setReserveFormLocalStatus('EMPTY')
    }
  }, [seat.is_lock, seat.status])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOnReserve = (seatName: any, seatEmail: any, seatLineID: any, seatPhone: any) => {
    onChange({
      ...seat,
      name: seatName,
      status: SeatStatus[SeatStatus.RESERVE],
      email: seatEmail,
      line_id: seatLineID,
      phone: seatPhone
    })
  }

  const regexPattern = /^#\d+$/
  const isDefaultName = regexPattern.test(seat.name || '#1')

  const ChooseActionForm = useCallback(
    () => (
      <>
        <DialogContent>
          <Typography variant='subtitle2' sx={{ mt: 1 }} component='span'>
            {`การล็อกที่นั่งจะทำให้ลูกทัวร์จองที่ไม่ได้ การจองแทนลูกทัวร์จะสร้างการจองให้ในระบบ`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              onChange({ ...seat, is_lock: true, status: SeatStatus[SeatStatus.RESERVE] })
              handleClose()
            }}
          >
            ล็อกที่นั่ง
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setReserveFormLocalStatus('RESERVE')
            }}
          >
            จองแทนลูกทัวร์
          </Button>
          <Button onClick={handleClose}>ปิด</Button>
        </DialogActions>
      </>
    ),
    [onChange, seat]
  )

  const LockForm = () => (
    <>
      <DialogContent>
        <Typography variant='subtitle2' sx={{ mt: 1 }} color='red'>
          {`คุณกำลังจะปลดล็อกที่นั่ง! โปรดตรวจสอบว่าถูกต้องแล้ว`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='error'
          onClick={() => {
            onChange({ ...seat, is_lock: false, status: SeatStatus[SeatStatus.EMPTY] })
            handleClose()
            setReserveFormLocalStatus('EMPTY')
          }}
        >
          ปลดล็อก
        </Button>
        <Button onClick={handleClose}>ปิด</Button>
      </DialogActions>
    </>
  )

  const formToRender = () => {
    const renderSwitch = (seatFormStatus: string) => {
      switch (seatFormStatus) {
        case 'RESERVE':
          return (
            <ReserveForm
              isDefaultName={isDefaultName}
              seat={seat}
              handleClose={handleClose}
              setReserveFormLocalStatus={setReserveFormLocalStatus}
              onChange={onChange}
              handleOnReserve={handleOnReserve}
            />
          )
        case 'PENDING':
          return (
            <ReserveForm
              isDefaultName={isDefaultName}
              seat={seat}
              handleClose={handleClose}
              setReserveFormLocalStatus={setReserveFormLocalStatus}
              onChange={onChange}
              handleOnReserve={handleOnReserve}
            />
          )
        case 'LOCKED':
          return <LockForm />
        default:
          return <ChooseActionForm />
      }
    }

    return renderSwitch(reserveFormLocalStatus)
  }

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClickOpen}
        color={seat.is_lock ? 'error' : isDefaultName ? 'primary' : 'info'}
        style={
          seat.status === SeatStatus[SeatStatus.RESERVE] ||
          seat.is_lock ||
          seat.status === SeatStatus[SeatStatus.PENDING]
            ? { height: '100%', width: '100%', boxShadow: 'none' }
            : { boxShadow: 'none' }
        }
      >
        <div style={{ display: 'flex' }}>
          {seat.status === SeatStatus[SeatStatus.RESERVE] || seat.status === SeatStatus[SeatStatus.PENDING] ? (
            ''
          ) : (
            <div style={{ paddingRight: '5px' }}>
              <EventSeat />
            </div>
          )}
          {showSeatText(seat)}
        </div>
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`เปลี่ยนสถานะที่นั่ง #${seat.seat_number}`}</DialogTitle>
        {formToRender()}
      </Dialog>
    </>
  )
}

const ReserveForm = ({
  isDefaultName,
  seat,
  handleClose,
  setReserveFormLocalStatus,
  onChange,
  handleOnReserve
}: any) => {
  const [seatName, setSeatName] = useState<string>(seat.name || '')
  const [seatEmail, setSeatEmail] = useState<string>(seat.email || '')
  const [seatLineID, setSeatLineID] = useState<string>(seat.line_id || '')
  const [seatPhone, setSeatPhone] = useState<string>(seat.phone || '')

  const informationFilled = seatName && seatEmail && seatLineID && seatPhone

  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item md={12}>
              {!isDefaultName && (
                <Typography variant='subtitle2' sx={{ mt: 1 }} color='red'>
                  {`คุณกำลังเปลี่ยนสถานะของ "${seat.name}"`}
                </Typography>
              )}
            </Grid>
            <Grid item md={12}>
              <TextField
                label='อีเมล'
                value={seatEmail}
                onChange={v => setSeatEmail(v.target.value)}
                defaultValue={seat.email || ''}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                label='ชื่อผู้จอง'
                value={seatName}
                onChange={v => setSeatName(v.target.value)}
                defaultValue={seat.name || ''}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                label='LINE ID'
                value={seatLineID}
                onChange={v => setSeatLineID(v.target.value)}
                defaultValue={seat.line_id || ''}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                label='เบอร์โทร'
                value={seatPhone}
                onChange={v => setSeatPhone(v.target.value)}
                defaultValue={seat.phone || ''}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          onClick={() => {
            if (!informationFilled) {
              return
            }
            handleOnReserve(seatName, seatEmail, seatLineID, seatPhone)
            handleClose()
            setReserveFormLocalStatus('RESERVE')
          }}
        >
          คอนเฟิร์ม
        </Button>
        {seat.status === SeatStatus[SeatStatus.RESERVE] && (
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {
              onChange({
                ...seat,
                name: `#${seat.seat_number}`,
                status: SeatStatus[SeatStatus.EMPTY],
                email: '',
                line_id: '',
                phone: ''
              })
              handleClose()
              setReserveFormLocalStatus('EMPTY')
            }}
          >
            ยกเลิกการจอง
          </Button>
        )}
        <Button
          onClick={() => {
            if (!informationFilled) {
              setReserveFormLocalStatus('EMPTY')
            }
            handleClose()
          }}
        >
          ปิด
        </Button>
      </DialogActions>
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
    return `${seat.seat_number}`
  }
}
