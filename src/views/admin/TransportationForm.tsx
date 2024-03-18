import { Box, Button, Card, CardContent, CardHeader, Grid, Paper, TextField } from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Seat, SeatStatus, TransportData, Transportation } from 'src/@core/types/transport'

interface TransportationFormProps {
  tripID: string
  transportsData?: TransportData[]
  onSubmit: SubmitHandler<any>
}

function range(start: number, end: number, step = 1): number[] {
  const array = []
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    array.push(i)
  }

  return array
}

const getDefaultTransport = (totalSeats: number, defaultName: string, transport_by: Transportation) => {
  const seats = range(1, totalSeats).map(numb => {
    return {
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

export default function TransportationForm(props: TransportationFormProps) {
  const { transportsData } = props

  const defaultValues = {
    transportData: transportsData || []
  }

  const { register, handleSubmit, control, watch, setValue } = useForm({ defaultValues })

  const {
    fields: transports,
    append: appendTransport,
    remove: removeTransport
  } = useFieldArray({
    control,
    name: 'transportData'
  })

  return (
    <Card>
      <CardHeader title='Transportation' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant='outlined'
                  style={{ marginRight: 20 }}
                  onClick={() => appendTransport(getDefaultTransport(10, 'VAN #1', Transportation.VAN))}
                >
                  ADD VAN
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => appendTransport(getDefaultTransport(5, 'SELF #1', Transportation.SELF))}
                >
                  ADD OTHER
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {transports.map((item, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: 20 }}>
                  <Grid item xs={4}>
                    <TextField {...register(`transportData.${index}.name`)} label='Name' defaultValue={item.name} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      {...register(`transportData.${index}.transport_by`)}
                      label='Transport By'
                      disabled
                      defaultValue={item.transport_by}
                      style={{ marginLeft: 10 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      {...register(`transportData.${index}.total_seats`)}
                      label='Total Seats'
                      disabled={item.transport_by === Transportation[Transportation.VAN]}
                      defaultValue={item.total_seats}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {item.transport_by === Transportation[Transportation.VAN] ? (
                      <VanForm
                        values={watch(`transportData.${index}.seats`)}
                        onChange={(data: Seat[]) => setValue(`transportData.${index}.seats`, data)}
                      />
                    ) : (
                      <TransportationNormalForm />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <Button type='button' variant='outlined' onClick={() => removeTransport(index)}>
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

interface VanFormProps {
  values: Seat[]
  onChange: (data: Seat[]) => void
}

export function VanForm(props: VanFormProps) {
  const { values, onChange } = props

  const handleLock = (seatNumber: number) => {
    const res = values.map(v => {
      if (v.seat_number === seatNumber) {
        return {
          ...v,
          is_lock: !v.is_lock
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
          <Button variant='contained' onClick={() => handleLock(1)} color={values[0].is_lock ? 'error' : 'primary'}>
            {values[0].is_lock ? 'LOCK' : '#1'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={8} key={'driver'}>
        <Paper
          style={{ height: 100, textAlign: 'center', lineHeight: '100px', backgroundColor: 'grey', color: 'white' }}
        >
          DRIVER
        </Paper>
      </Grid>
      <Grid item xs={4} key={'2'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(2)} color={values[1].is_lock ? 'error' : 'primary'}>
            {values[1].is_lock ? 'LOCK' : '#2'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'3'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(3)} color={values[2].is_lock ? 'error' : 'primary'}>
            {values[2].is_lock ? 'LOCK' : '#3'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'4'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(4)} color={values[3].is_lock ? 'error' : 'primary'}>
            {values[3].is_lock ? 'LOCK' : '#4'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'5'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          {' '}
          <Button variant='contained' onClick={() => handleLock(5)} color={values[4].is_lock ? 'error' : 'primary'}>
            {values[4].is_lock ? 'LOCK' : '#5'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'6'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(6)} color={values[5].is_lock ? 'error' : 'primary'}>
            {values[5].is_lock ? 'LOCK' : '#6'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'7'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(7)} color={values[6].is_lock ? 'error' : 'primary'}>
            {values[6].is_lock ? 'LOCK' : '#7'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'8'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          {' '}
          <Button variant='contained' onClick={() => handleLock(8)} color={values[7].is_lock ? 'error' : 'primary'}>
            {values[7].is_lock ? 'LOCK' : '#8'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'9'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          <Button variant='contained' onClick={() => handleLock(9)} color={values[8].is_lock ? 'error' : 'primary'}>
            {values[8].is_lock ? 'LOCK' : '#9'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={4} key={'10'}>
        <Paper style={{ height: 100, textAlign: 'center', lineHeight: '100px' }}>
          {' '}
          <Button variant='contained' onClick={() => handleLock(10)} color={values[9].is_lock ? 'error' : 'primary'}>
            {values[9].is_lock ? 'LOCK' : '#10'}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  )
}

export function TransportationNormalForm() {
  return <div />
}
