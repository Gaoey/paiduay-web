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

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  [TripStatus[TripStatus.Full]]: { color: 'info' },
  [TripStatus[TripStatus.NotFull]]: { color: 'primary' },
  [TripStatus[TripStatus.NotAvailable]]: { color: 'error' }
}

const DashboardTable = () => {
  const router = useRouter()
  const { tripAPI, profilerAPI } = useApi()

  const { getCurrentProfiler } = profilerAPI
  const { findTripByProfilerID } = tripAPI

  const { data } = findTripByProfilerID

  useEffect(() => {
    async function getTripsList() {
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

    getTripsList()
  }, [])

  const trips: Trip[] = R.isNil(data) ? [] : (data as Trip[])

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Payments</TableCell>
              <TableCell>From - To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ACTIONs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((row: Trip, index) => {
              const total_payments = row.data.total_people * (row.data.payment?.full_price || 1)

              return (
                <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                        {row.data.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.data.locations.reduce((prev, curr) => `${prev}, ${curr.title}`, '')}</TableCell>
                  <TableCell>{`${row.data.members.length} / ${row.data.total_people}`}</TableCell>
                  <TableCell>{`${toCurrency(0.0)} / ${toCurrency(total_payments)}`}</TableCell>
                  <TableCell>{`${format(new Date(row.data.from_date), 'dd-MM-yyyy')} - ${format(
                    new Date(row.data.to_date),
                    'dd-MM-yyyy'
                  )}`}</TableCell>
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
                  <TableCell>
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      <Button
                        variant='contained'
                        style={{ color: 'white', marginRight: 20 }}
                        onClick={() => router.push(`/admin/trip-list/${row._id}`)}
                      >
                        VIEW
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

export default DashboardTable
