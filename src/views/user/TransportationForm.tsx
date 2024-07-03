import { LoadingButton } from '@mui/lab'
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
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useApi } from 'src/@core/services'
import { Seat, SeatStatus, Transport, Transportation } from 'src/@core/types/transport'
import { UserProfile } from 'src/@core/types/user'
import { range } from '../admin/TransportationForm'

interface VanBookingForm {
  values: Seat[]
  tripID: string
  transportID: string
  isViewOnly?: boolean
}

export function showSeatText(seat: Seat): string {
  if (seat.is_lock) {
    return 'LOCK'
  } else if (seat.status !== SeatStatus[SeatStatus.EMPTY]) {
    return 'X'
  } else {
    return `#${seat.seat_number}`
  }
}

export function VanBookingForm(props: VanBookingForm) {
  const { values, tripID, transportID, isViewOnly = false } = props
  const [seats, setSeats] = useState<Seat[]>(values || [])

  const onSetSeat = (seats: Seat[], seat: Seat) => {
    const newSeats: Seat[] = seats.map(v => {
      if (seat.seat_number === v.seat_number) {
        return seat
      }

      return v
    })

    setSeats(newSeats)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} key={'1'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <SeatButton seat={seats[0]} onSetSeat={(seat: Seat) => onSetSeat(seats, seat)} isViewOnly={isViewOnly} />
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
              <SeatButton
                seat={seats[pos - 1]}
                onSetSeat={(seat: Seat) => onSetSeat(seats, seat)}
                isViewOnly={isViewOnly}
              />
            </Paper>
          </Grid>
        )
      })}
      {!isViewOnly && (
        <Grid item xs={12}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <ConfirmSeatButton seats={seats} tripID={tripID} transportID={transportID} />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

interface TransportationNormalBookingFormProps {
  values: Seat[]
  tripID: string
  transportID: string
  isViewOnly?: boolean
}

export function TransportationNormalBookingForm(props: TransportationNormalBookingFormProps) {
  const { values, tripID, transportID, isViewOnly = false } = props
  const [seats, setSeats] = useState<Seat[]>(values || [])

  const onSetSeat = (seats: Seat[], seat: Seat) => {
    const newSeats: Seat[] = seats.map(v => {
      if (seat.seat_number === v.seat_number) {
        return seat
      }

      return v
    })

    setSeats(newSeats)
  }

  return (
    <Grid container spacing={2}>
      {range(1, values.length).map(pos => {
        return (
          <Grid item xs={4} key={pos}>
            <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
              <SeatButton
                seat={seats[pos - 1]}
                onSetSeat={(seat: Seat) => onSetSeat(seats, seat)}
                isViewOnly={isViewOnly}
              />
            </Paper>
          </Grid>
        )
      })}
      {!isViewOnly && (
        <Grid item xs={12}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <ConfirmSeatButton seats={seats} tripID={tripID} transportID={transportID} />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

interface SeatButtonProps {
  seat: Seat
  onSetSeat: (seat: Seat) => void
  isViewOnly?: boolean
}

function SeatButton(props: SeatButtonProps) {
  const { seat, onSetSeat, isViewOnly = false } = props
  const isSelectSeat = seat.isSelect
  const bgColor = seat.is_lock ? 'error' : isSelectSeat ? 'success' : 'primary'
  const disabled = seat.is_lock || seat.status != SeatStatus[SeatStatus.EMPTY]
  if (isViewOnly && isSelectSeat) {
    return (
      <Box
        color='success'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          bgcolor: 'green',
          height: '100%'
        }}
      >
        <Typography sx={{ color: 'white' }}>{'#' + seat.seat_number}</Typography>
      </Box>
    )
  }

  return (
    <Button
      variant='contained'
      color={bgColor}
      disabled={disabled || isViewOnly}
      onClick={() => {
        onSetSeat({ ...seat, isSelect: !seat.isSelect })
      }}
      sx={{
        disabledBackground: isViewOnly && !disabled ? 'green' : 'grey'
      }}
    >
      {isViewOnly ? seat.isSelect && '#' + seat.seat_number : showSeatText(seat)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserProfile>({ defaultValues })

  const onSubmit: SubmitHandler<any> = data => {
    const profile: UserProfile = {
      ...userData?.profile,
      ...data
    }
    updateProfile.mutate(profile)
  }

  const linkto = useCallback(() => {
    const selectedSeats = seats.filter(v => v.isSelect)
    const query = selectedSeats.reduce((prev, curr) => {
      return `${prev}&seat_number=${curr.seat_number}`
    }, '')
    router.push(`/trips/${tripID}/booking?transport_id=${transportID}&${query}`)
  }, [router, seats, transportID, tripID])

  useEffect(() => {
    if (isSuccess) {
      linkto()
    }
  }, [isSuccess, linkto])

  const seatsAvailable = seats.filter(v => v.isSelect === true)

  return (
    <>
      <Button variant='contained' onClick={handleClickOpen} color='info' disabled={seatsAvailable.length === 0}>
        จองเลย
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{hasUserData ? `ยืนยันการจองใช่ใหม?` : 'เพิ่มข้อมูลส่วนตัว'}</DialogTitle>
        {!hasUserData ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                <DialogContentText sx={{ marginBottom: 10 }}>
                  โปรดใส่ข้อมูลส่วนตัวเพื่อให้หัวหน้าทริปติดต่อคุณได้ง่ายขึ้น
                </DialogContentText>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='ชื่อ'
                      fullWidth
                      {...register('first_name', { required: 'โปรดใส่ชื่อ' })}
                      error={Boolean(errors?.first_name)}
                      helperText={errors?.first_name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='นามสกุล'
                      fullWidth
                      {...register('last_name', { required: 'โปรดใส่นามสกุล' })}
                      error={Boolean(errors?.last_name)}
                      helperText={errors?.last_name?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='เบอร์ติดต่อ'
                      type='tel'
                      inputProps={{ pattern: '^[0-9]*$' }}
                      fullWidth
                      {...register('telephone_number', { required: 'โปรดใส่เบอร์ติดต่อ' })}
                      error={Boolean(errors?.telephone_number)}
                      helperText={errors?.telephone_number?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Line ID'
                      fullWidth
                      {...register('line_contacts', { required: 'โปรดใส่ LINE id' })}
                      error={Boolean(errors?.line_contacts)}
                      helperText={errors?.line_contacts?.message}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <LoadingButton variant='contained' type='submit' loading={isLoading}>
                  บันทึก
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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

interface ViewTransportationTabProps {
  tripID: string
  transports: Transport[]
  isViewOnly?: boolean
}

export function ViewTransportationTab({ tripID, transports, isViewOnly = false }: ViewTransportationTabProps) {
  const [tab, setTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Grid container spacing={7}>
      <Grid item md={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleChange} aria-label='select transport tab'>
            {!R.isEmpty(transports) &&
              transports.map((item, index) => {
                return <Tab key={index} label={item.data.name} {...a11yProps(0)} />
              })}
          </Tabs>
        </Box>
      </Grid>
      <Grid item md={12}>
        {!R.isEmpty(transports) &&
          transports.map((item, index) => {
            if (item.data.transport_by === Transportation[Transportation.VAN]) {
              return (
                <CustomTabPanel value={tab} index={index} key={item._id}>
                  <VanBookingForm
                    values={item.data.seats}
                    tripID={tripID}
                    transportID={item._id}
                    isViewOnly={isViewOnly}
                  />
                </CustomTabPanel>
              )
            } else {
              return (
                <CustomTabPanel value={tab} index={index} key={item._id}>
                  <TransportationNormalBookingForm
                    key={item._id}
                    values={item.data.seats}
                    tripID={tripID}
                    transportID={item._id}
                    isViewOnly={isViewOnly}
                  />
                </CustomTabPanel>
              )
            }
          })}
      </Grid>
    </Grid>
  )
}
