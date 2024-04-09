import { Button, Dialog, DialogActions, DialogTitle, Grid, TextField } from '@mui/material'

import { useState } from 'react'
import { Seat, Transport } from 'src/@core/types/transport'
import { VanForm } from './TransportationForm'

interface Props {
  item: Transport
  onRemoveTransport: (tripID: string, transportID: string) => void
  onSetSeat: (seats: Seat[]) => void
}

export default function VanDetail({ item, onSetSeat, onRemoveTransport }: Props) {
  const [isEdit, setIsEdit] = useState(false)

  return (
    <Grid container spacing={2} key={item._id} style={{ marginBottom: 40 }}>
      <Grid item xs={4}>
        <TextField label='Name' defaultValue={item.data.name} fullWidth disabled={!isEdit} sx={{ height: 50 }} />
      </Grid>
      <Grid item xs={4}>
        <TextField label='Transport By' defaultValue={item.data.transport_by} disabled />
      </Grid>

      <Grid item xs={4}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {!isEdit ? (
              <Button variant='contained' onClick={() => setIsEdit(!isEdit)} sx={{ height: 55, width: '100%' }}>
                EDIT
              </Button>
            ) : (
              <Button
                variant='contained'
                color='success'
                onClick={() => setIsEdit(!isEdit)}
                sx={{ height: 55, width: '100%' }}
              >
                SAVE
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
        <VanForm values={item.data.seats} onChange={(seat: Seat[]) => onSetSeat(seat)} />
      </Grid>
    </Grid>
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
