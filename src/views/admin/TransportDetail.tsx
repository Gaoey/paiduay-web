import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'

import { useState, useEffect } from 'react'
import { Seat, Transport, TransportData, Transportation } from 'src/@core/types/transport'
import { TransportationNormalForm, VanForm, getDefaultTransport } from './TransportationForm'
import { useForm } from 'react-hook-form'

interface Props {
  item: Transport
  onRemoveTransport: (tripID: string, transportID: string) => void
  onSetSeat: (seats: Seat[]) => void
  onUpdateTransport: (transportID: string, transport: TransportData) => void
}

export default function TransportDetail({ item, onSetSeat, onRemoveTransport, onUpdateTransport }: Props) {
  const [isEdit, setIsEdit] = useState(false)
  const [transportName, setTransportName] = useState<string>(item.data.name)

  return (
    <Card sx={{ padding: '2em', marginBottom: '2em' }}>
      <Grid container spacing={4} key={item._id}>
        <Grid item xs={4}>
          <TextField
            label='Name'
            fullWidth
            disabled={!isEdit}
            sx={{ height: 50 }}
            value={transportName}
            onChange={e => setTransportName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField label='Transport By' defaultValue={item.data.transport_by} disabled />
        </Grid>

        <Grid item xs={4}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              {!isEdit ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    setIsEdit(!isEdit)
                  }}
                  sx={{ height: 55, width: '100%' }}
                >
                  แก้ไข
                </Button>
              ) : (
                <Button
                  variant='contained'
                  color='success'
                  onClick={() => {
                    setIsEdit(!isEdit)
                    const newTransportData: TransportData = { ...item.data, name: transportName }
                    onUpdateTransport(item._id, newTransportData)
                  }}
                  sx={{ height: 55, width: '100%' }}
                >
                  บันทึก
                </Button>
              )}
            </Grid>
            <Grid item xs={6}>
              <RemoveTransportButton
                transportID={item._id}
                onRemove={(transportID: string) => {
                  onRemoveTransport(item.trip_id, transportID)
                  setIsEdit(!isEdit)
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {item.data.transport_by === Transportation[Transportation.VAN] ? (
            <VanForm values={item.data.seats} onChange={(seat: Seat[]) => onSetSeat(seat)} />
          ) : (
            <TransportationNormalForm values={item.data.seats} onChange={(seat: Seat[]) => onSetSeat(seat)} />
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

interface RemoveTripPopUpProps {
  transportID: string
  onRemove: (transportID: string) => void
}

function RemoveTransportButton(props: RemoveTripPopUpProps) {
  const { transportID, onRemove } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant='contained' color='error' onClick={handleClickOpen} sx={{ height: 55, width: '100%' }}>
        ลบ
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ยืนยันการลบไหม?`}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              onRemove(transportID)
              handleClose()
            }}
            variant='contained'
            color='error'
          >
            Confirm
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface AddTransportButtonProps {
  title: string
  tripID: string
  transportBy: Transportation | string
  onCreateTransport: (tripID: string, transportData: TransportData) => void
  transportNumber: number
}

export function AddTransportButton(props: AddTransportButtonProps) {
  const { title, onCreateTransport, transportBy, tripID, transportNumber } = props

  const defaultValues =
    transportBy === Transportation[Transportation.VAN]
      ? getDefaultTransport(10, `VAN #${transportNumber}`, Transportation.VAN)
      : getDefaultTransport(5, `SELF #${transportNumber}`, Transportation.SELF)

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues })

  const handleSubmitTransportForm = handleSubmit(data => {
    onCreateTransport(tripID, data)
    handleClose()
  })

  return (
    <>
      <Button variant='outlined' onClick={handleClickOpen} sx={{ marginRight: 5 }}>
        {title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmitTransportForm}>
          <DialogTitle>{`เพิ่มภาหนะใหม่`}</DialogTitle>
          <DialogContent style={{ margin: 10, padding: 10 }}>
            <Grid container spacing={7}>
              <Grid item xs={4}>
                <TextField {...register(`name`)} label='ชื่อ' value={defaultValues.name} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register(`transport_by`, { required: 'ต้องมีวิธีการเดินทาง' })}
                  label='เดินทางด้วย'
                  disabled
                  fullWidth
                  defaultValue={defaultValues.transport_by}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...register(`total_seats`, { required: 'ต้องมีจำนวนที่นั่ง' })}
                  label='จำนวนที่นั่ง'
                  disabled={transportBy === Transportation[Transportation.VAN]}
                  defaultValue={defaultValues.total_seats}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                {transportBy === Transportation[Transportation.VAN] ? (
                  <VanForm values={watch(`seats`)} onChange={(data: Seat[]) => setValue(`seats`, data)} />
                ) : (
                  <TransportationNormalForm
                    values={watch(`seats`)}
                    onChange={(data: Seat[]) => setValue(`seats`, data)}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type='submit' variant='contained' color='secondary'>
              Confirm
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
