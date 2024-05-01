import { Grid } from '@mui/material'
import { LoadingComponent } from 'src/@core/components/loading'
import { Trip } from 'src/@core/types/trip'
import TripCard from 'src/views/user/TripCard'

interface Props {
  isLoading: boolean
  trips: Trip[]
  hideProfiler?: boolean
}
export default function TripCardList({ isLoading, trips, hideProfiler = false }: Props) {
  return (
    <Grid container spacing={7}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        trips.map(item => (
          <Grid key={item._id} item xs={12} sm={6} md={4} lg={4}>
            <TripCard trip={item} hideProfiler={hideProfiler} />
          </Grid>
        ))
      )}
    </Grid>
  )
}
