import { CircularProgress, Grid, Link, List, ListItem } from '@mui/material'
import { Trip } from 'src/@core/types/trip'
import TripCard from 'src/views/user/TripCard'

interface Props {
  isLoading: boolean
  trips: Trip[]
  hideProfiler?: boolean
}
export default function TripCardList({ isLoading, trips, hideProfiler = false }: Props) {
  return (
    <List>
      <Grid container spacing={7}>
        {isLoading ? (
          <CircularProgress size={40} color='primary' />
        ) : (
          trips.map(item => (
            <Grid key={item._id} item xs={12} sm={12} md={4} lg={4}>
              <ListItem>
                <Link target='_blank' href={`/trips/${item._id}`}>
                  <TripCard trip={item} hideProfiler={hideProfiler} />
                </Link>
              </ListItem>
            </Grid>
          ))
        )}
      </Grid>
    </List>
  )
}
