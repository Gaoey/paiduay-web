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
import { Button } from '@mui/material'

// import { useRouter } from 'next/router'
import { ThemeColor } from 'src/@core/layouts/types'
import { Booking, BookingStatus } from 'src/@core/types/booking'
import { Transport } from 'src/@core/types/transport'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  [BookingStatus[BookingStatus.CONFIRM]]: { color: 'info' },
  [BookingStatus[BookingStatus.PENDING]]: { color: 'primary' },
  [BookingStatus[BookingStatus.NONE]]: { color: 'error' },
  [BookingStatus[BookingStatus.FAILED]]: { color: 'error' },
  [BookingStatus[BookingStatus.PAID]]: { color: 'info' }
}

interface Props {
  bookings: Booking[]
  transports: Transport[]
}

const BookingTable = (props: Props) => {
  // const router = useRouter()
  const { bookings, transports } = props

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Transport name</TableCell>
              <TableCell>Seat name</TableCell>
              <TableCell>Seat number</TableCell>
              <TableCell>Booking Status</TableCell>
              <TableCell>Slips</TableCell>
              <TableCell>ACTIONs</TableCell>
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
                      color={statusObj[row.data.status].color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  </TableCell>
                  <TableCell>View Slips</TableCell>
                  <TableCell>
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      <Button variant='contained' style={{ color: 'white', marginRight: 20 }}>
                        VIEW USER
                      </Button>
                      <Button variant='contained' style={{ color: 'white', marginRight: 20 }}>
                        UPDATE STATUS
                      </Button>
                      <Button variant='outlined' style={{ marginRight: 20 }}>
                        EDIT
                      </Button>
                      <Button variant='outlined'>REMOVE</Button>
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

export default BookingTable
