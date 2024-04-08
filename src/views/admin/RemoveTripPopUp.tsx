// ** MUI Imports

// ** Types Imports
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

// import { useRouter } from 'next/router'
import { useState } from 'react'

interface RemoveTripPopUpProps {
  tripID: string
  onRemove: (tripID: string) => void
}

function RemoveTripPopUp(props: RemoveTripPopUpProps) {
  const { tripID, onRemove } = props

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant='contained' color='error' onClick={handleClickOpen} style={{ color: 'white', marginRight: 20 }}>
        ลบ
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`ยืนยันการลบไหม?`}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              onRemove(tripID)
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

export default RemoveTripPopUp
