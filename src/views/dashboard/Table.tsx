// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { CardContent, CardHeader, Grid } from '@mui/material';

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

interface RowType {
  age: number
  name: string
  date: string
  email: string
  salary: string
  status: string
  designation: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}


const ResponsiveCards = ({ rows }: { rows: RowType[] }) => {
  return (
    <Grid container spacing={3}> {/* Grid for layout */}
      {rows.map((row) => (
        <Grid item xs={12} sm={6} md={4} key={row.name}> {/* Responsive sizing */}
          <Card>
            <CardHeader
              title={row.name}
              subheader={row.designation}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2">{row.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Date:</Typography>
                  <Typography variant="body2">{row.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Salary:</Typography>
                  <Typography variant="body2">{row.salary}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Age:</Typography>
                  <Typography variant="body2">{row.age}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    size="small"
                    sx={{ '& .MuiChip-label': { fontWeight: 500 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveCards
