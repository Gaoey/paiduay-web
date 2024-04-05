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
import Typography from '@mui/material/Typography'

// ** Types Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

// import { useRouter } from 'next/router'
import { useState } from 'react'
import { ThemeColor } from 'src/@core/layouts/types'
import { Booking, BookingData, BookingStatus } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'
import { Media } from 'src/@core/types'
import ImageCarousel from 'src/@core/components/image-carousel'
import { useRouter } from 'next/router'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

export const bookingStatusObj: StatusObj = {
  [BookingStatus[BookingStatus.CONFIRM]]: { color: 'success' },
  [BookingStatus[BookingStatus.PENDING]]: { color: 'primary' },
  [BookingStatus[BookingStatus.NONE]]: { color: 'error' },
  [BookingStatus[BookingStatus.FAILED]]: { color: 'error' },
  [BookingStatus[BookingStatus.PAID]]: { color: 'info' }
}

interface Props {
  bookings: Booking[]
  transports: Transport[]
  onUpdateBooking: (bookingID: string, params: BookingData) => void
}

const BookingTable = (props: Props) => {
  // const router = useRouter()
  const { bookings, transports, onUpdateBooking } = props
  const router = useRouter()

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>วิธีเดินทาง</TableCell>
              <TableCell>ชื่อที่นั่ง</TableCell>
              <TableCell>เบอร์ที่นั่ง</TableCell>
              <TableCell>สถานะการจอง</TableCell>
              <TableCell>แก้ไข</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row: Booking, index) => {
              const transport: Transport = transports.filter(v => v._id === row.data.transport_id)[0]

              return (
                <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                        {transport?.data?.name || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.data.seat_name}</TableCell>
                  <TableCell>{row.data.seat_number}</TableCell>
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
                      <ViewSlipButton slipImg={row.data.slips} />
                      <Button
                        variant='contained'
                        color='success'
                        style={{ color: 'white', marginRight: 20 }}
                        onClick={() => router.push(`/user/${row.data.user_id}`)}
                      >
                        ดูลูกทริป
                      </Button>
                      <UpdateStatusButton
                        onChange={status => {
                          const newBooking: BookingData = {
                            ...row.data,
                            status
                          }
                          onUpdateBooking(row._id, newBooking)
                        }}
                      />
                      <Button variant='outlined' style={{ marginRight: 20 }}>
                        แก้ไข
                      </Button>
                      <Button variant='outlined'>ลบ</Button>
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

interface UpdateStatusButtonProps {
  onChange: (status: BookingStatus | string) => void
}

function UpdateStatusButton(props: UpdateStatusButtonProps) {
  const { onChange } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant='contained' color='info' onClick={handleClickOpen} style={{ color: 'white', marginRight: 20 }}>
        เปลี่ยนสถานะ
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ต้องการจะคอนเฟิร์มเงินโอนไหม?`}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.CONFIRM]
              onChange(status)
              handleClose()
            }}
            variant='contained'
            color='info'
          >
            คอนเฟิร์ม
          </Button>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.PENDING]
              onChange(status)
              handleClose()
            }}
            variant='contained'
            color='primary'
          >
            รอรับเงินอยู่
          </Button>
          <Button
            onClick={() => {
              const status = BookingStatus[BookingStatus.FAILED]
              onChange(status)
              handleClose()
            }}
            variant='contained'
            color='error'
          >
            ปฏิเสธการรับเงิน
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface ViewSlipButtonProps {
  slipImg: Media[]
}

function ViewSlipButton(props: ViewSlipButtonProps) {
  const { slipImg } = props

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
        ดูสลิป
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>สลิป</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText>
            <ImageCarousel medias={slipImg} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingTable
