// ** MUI Imports
import Groups from '@mui/icons-material/Groups'
import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Types Imports
import { Button } from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect } from 'react'
import { ThemeColor } from 'src/@core/layouts/types'
import { useApi } from 'src/@core/services'
import { Paginate } from 'src/@core/types'
import { Profiler } from 'src/@core/types/profiler'
import { Trip, TripStatus } from 'src/@core/types/trip'
import { toCurrency } from 'src/@core/utils/currency'
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

const DashboardCards = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isSuccess) {
      getTripsList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const trips: Trip[] = R.isNil(data) ? [] : (data as Trip[])

  const renderTrips = trips.map((trip: Trip) => (
    <Grid item xs={12} key={trip._id}>
      <Card>
        <Grid container spacing={3} columns={12} style={{ alignItems: 'center', padding: '1em' }}>
          <Grid item xs={12} sm={6} md={4} sx={{ marginLeft: '0.2em' }}>
            <Typography variant='body1' color='text.primary' style={{ fontWeight: 'bold' }}>
              {trip.data.title || 'Trip Title Unavailable'}
            </Typography>
            <Typography variant='body2' color='text.subtitle' style={{}}>
              {`${format(new Date(trip.data.from_date), 'dd/MM/yy')} - ${format(
                new Date(trip.data.to_date),
                'dd/MM/yy'
              )}`}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={3} md={1.5}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5em' }}>
              <Groups style={{ color: '#3B5249' }} />
              <Typography variant='body2' style={{ marginLeft: '0.5em' }}>
                {`${trip.data.members.length} / ${trip.data.total_people}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={8} sm={3} md={1.5} style={{ paddingLeft: '0.5em' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2'>{`${toCurrency(trip?.data?.payment?.accumulate_price || 0)}`}</Typography>
            </div>
          </Grid>
          <Grid item xs={4} sm={6} md={1}>
            <Chip
              label={statusObj[trip.data.status].display}
              color={statusObj[trip.data.status].color}
              size='medium'
              sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
              style={{ marginLeft: '0.5em' }}
            />
          </Grid>
          <Grid item xs={8} sm={6} md={4} style={{ paddingLeft: '0.5em' }}>
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
                tripName={trip.data.title}
                onRemove={(tripID: string) => removeTrip.mutate(tripID)} // Pass tripID and removal handler down
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  ))

  const emptyTrip = (
    <div style={{ textAlign: 'center', width: '100%', marginTop: '2em', padding: '2em' }}>
      <Button
        variant='contained'
        color='primary'
        fullWidth
        style={{ fontSize: '1em' }}
        onClick={() => router.push(`/admin/create-trip`)}
      >
        เริ่มสร้างทริปกัน!
      </Button>
    </div>
  )

  return (
    <Grid container spacing={3}>
      {trips.length > 0 ? renderTrips : emptyTrip}
    </Grid>
  )
}

export default DashboardCards
