// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import { CardContent, CardHeader, Grid } from '@mui/material'
import Groups from '@mui/icons-material/Groups'
import { useTheme } from '@mui/material/styles'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { useApi } from 'src/@core/services'
import { useEffect } from 'react'
import { Profiler } from 'src/@core/types/profiler'
import * as R from 'ramda'
import { Paginate } from 'src/@core/types'
import { Trip, TripStatus } from 'src/@core/types/trip'
import { format } from 'date-fns'
import { Button } from '@mui/material'
import { toCurrency } from 'src/@core/utils/currency'
import { useRouter } from 'next/router'
import RemoveTripPopUp from './RemoveTripPopUp'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
    display: string
  }
}

const statusObj: StatusObj = {
  [TripStatus[TripStatus.Full]]: { color: 'info', display: 'เต็ม' },
  [TripStatus[TripStatus.NotFull]]: { color: 'primary', display: 'ไม่เต็ม' },
  [TripStatus[TripStatus.NotAvailable]]: { color: 'error', display: 'ผ่านไปแล้ว' }
}

const DashboardTable = () => {
  const router = useRouter()
  const { tripAPI, profilerAPI } = useApi()

  const { getCurrentProfiler } = profilerAPI
  const { findTripByProfilerID, removeTrip } = tripAPI

  const { isSuccess } = removeTrip
  const { data } = findTripByProfilerID

  const getTripsList = async () => {
    const profiler: Profiler[] = await getCurrentProfiler()
    if (!R.isEmpty(profiler)) {
      const currProfiler = profiler[0]
      const paginate: Paginate = {
        page_size: 50,
        page_number: 1
      }

      // TODO:: filter only available trips (ยังมาไม่ถึง)
      findTripByProfilerID.mutate({ profilerID: currProfiler._id, paginate })
    }
  }

  useEffect(() => {
    getTripsList()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      getTripsList()
    }
  }, [isSuccess])

  const trips: Trip[] = R.isNil(data) ? [] : (data as Trip[])

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อทริป</TableCell>
              <TableCell>จำนวนคน</TableCell>
              <TableCell>จำนวนเงิน</TableCell>
              <TableCell>ไป - กลับ</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>ปุ่ม</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((row: Trip, index) => {
              const total_payments = row.data.total_people * (row.data.payment?.full_price || 1)
              const amount_received = row.data.payment?.accumulate_price || 0.0

              return (
                <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                        {row.data.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{`${row.data.members.length} / ${row.data.total_people}`}</TableCell>
                  <TableCell>{`${toCurrency(amount_received)} / ${toCurrency(total_payments)}`}</TableCell>
                  <TableCell>{`${format(new Date(row.data.from_date), 'dd/MM/yyyy')} - ${format(
                    new Date(row.data.to_date),
                    'dd/MM/yyyy'
                  )}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusObj[row.data.status].display}
                      color={statusObj[row.data.status].color}
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
                      <Button
                        variant='contained'
                        style={{ color: 'white', marginRight: 20 }}
                        onClick={() => router.push(`/admin/trip-list/${row._id}`)}
                      >
                        ดู
                      </Button>
                      <Button
                        variant='outlined'
                        style={{ marginRight: 20 }}
                        onClick={() => router.push(`/admin/update-trip/${row._id}`)}
                      >
                        แก้ไข
                      </Button>
                      <RemoveTripPopUp tripID={row._id} onRemove={(tripID: string) => removeTrip.mutate(tripID)} />
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

const DashboardCards = ({ ...props }) => {
  const router = useRouter()
  const { tripAPI, profilerAPI } = useApi()

  const { getCurrentProfiler } = profilerAPI
  const { findTripByProfilerID, removeTrip } = tripAPI

  const { isSuccess } = removeTrip
  const { data } = findTripByProfilerID

  const getTripsList = async () => {
    const profiler: Profiler[] = await getCurrentProfiler()
    if (!R.isEmpty(profiler)) {
      const currProfiler = profiler[0]
      const paginate: Paginate = {
        page_size: 50,
        page_number: 1
      }

      // TODO:: filter only available trips (ยังมาไม่ถึง)
      findTripByProfilerID.mutate({ profilerID: currProfiler._id, paginate })
    }
  }

  useEffect(() => {
    getTripsList()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      getTripsList()
    }
  }, [isSuccess])

  const trips: Trip[] = R.isNil(data) ? [] : (data as Trip[])

  return (
    <Grid container spacing={3}>
      {trips.map((trip: Trip) => (
        <Grid item xs={12} sm={6} md={4} key={trip._id}>
          <Card>
            <CardHeader
              title={trip.data.title}
              subheader={`${format(new Date(trip.data.from_date), 'dd/MM/yyyy')} - ${format(
                new Date(trip.data.to_date),
                'dd/MM/yyyy'
              )}`}
              color='#fff'
              style={{
                backgroundColor: '#74B3CE'
              }}
            />
            <CardContent>
              <Grid container spacing={5} style={{ paddingTop: '1em' }}>
                <Grid item xs={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Groups style={{ color: '#3B5249' }} />
                    <Typography variant='body2' style={{ marginLeft: '0.5em' }}>
                      {`${trip.data.members.length} / ${trip.data.total_people}`}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>
                      THB
                    </Typography>
                    <Typography variant='body2' style={{ marginLeft: '0.5em' }}>
                      {`${trip?.data?.payment?.accumulate_price || 0} / ${
                        trip?.data?.payment?.full_price * trip.data.total_people
                      }`}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={statusObj[trip.data.status].display}
                    color={statusObj[trip.data.status].color}
                    size='small'
                    sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* Actions Row */}
                  <Box style={{ display: 'flex' }}>
                    <Button
                      variant='contained'
                      style={{ color: 'white', marginRight: '1em' }}
                      onClick={() => router.push(`/admin/trip-list/${trip._id}`)}
                    >
                      ดูข้อมูล
                    </Button>
                    <Button
                      style={{ marginRight: '1em' }}
                      variant='outlined'
                      onClick={() => router.push(`/admin/update-trip/${trip._id}`)}
                    >
                      แก้ไข
                    </Button>
                    <RemoveTripPopUp
                      tripID={trip._id}
                      onRemove={props.onRemove} // Pass tripID and removal handler down
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardCards
