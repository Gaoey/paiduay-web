import CloseOutlined from '@mui/icons-material/CloseOutlined'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as React from 'react'

export type AlertDataType = {
  onCallback?: (isConfirm: boolean) => void
  title?: string
  desciption?: string | React.ReactElement
  confirmTxt?: string
  cancelTxt?: string
  onCloseCallback?: () => void
}

export type AlertType = {
  open: boolean
  onClose: () => void
  data: AlertDataType
}

const AlertWarning = (props: AlertType) => {
  const { open, onClose, data } = props
  const { title, desciption }: AlertDataType = data

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='alert-warning-title'
      aria-describedby='alert-warning-description'
    >
      <Stack justifyContent='flex-end' flexDirection='row'>
        <IconButton onClick={onClose} color='primary' aria-label='cancel account' component='span'>
          <CloseOutlined sx={{ fontSize: '40px' }} />
        </IconButton>
      </Stack>
      <Stack sx={{ pb: '10px', pl: '30px', pr: '30px' }} spacing={1} justifyContent='center' alignItems='center'>
        <DialogTitle id='alert-warning-title'>
          <Typography color='primary'>{title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 5 }}>
          <DialogContentText id='alert-warning-description'>
            <Typography color='primary'>{desciption}</Typography>
          </DialogContentText>
        </DialogContent>
      </Stack>
    </Dialog>
  )
}

export default AlertWarning
