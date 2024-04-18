// ** React Imports
import { Fragment, ReactNode, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import { styled, Theme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import { CircularProgress } from '@mui/material'
import { formatDistance } from 'date-fns'
import * as R from 'ramda'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { useApi } from 'src/@core/services'
import { INotification, NotificationData, NotificationType } from 'src/@core/theme/notification'
import { Paginate } from 'src/@core/types'
import { useRouter } from 'next/router'

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

interface NotificationMsg {
  title: string
  description: string
  linkto: string | null
}

function getNotificationMsg(notification: INotification): NotificationMsg {
  if (notification.data.type === NotificationType[NotificationType.Booking]) {
    return {
      title: 'มีคนจองเข้ามา! 🎉',
      description: notification.data.message,
      linkto: `/admin/trip-list/${notification.data.trip_id}`
    }
  } else if (notification.data.type === NotificationType[NotificationType.UpdateBooking]) {
    return {
      title: 'มีคนแก้ไขการจอง',
      description: notification.data.message,
      linkto: `/admin/trip-list/${notification.data.trip_id}`
    }
  } else if (notification.data.type === NotificationType[NotificationType.NewTrip]) {
    return {
      title: 'มีทริปใหม่มาแล้ว',
      description: notification.data.message,
      linkto: `/trip/${notification.data.trip_id}`
    }
  } else {
    return {
      title: 'สวัสดีจ้า! 🎉',
      description: notification.data.message,
      linkto: null
    }
  }
}

const NotificationDropdown = () => {
  const router = useRouter()
  const { notificationAPI } = useApi()
  const { getNotifications, updateNotification } = notificationAPI

  const { data, isLoading } = getNotifications

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const handleDropdownOpen = (event: SyntheticEvent) => {
    const paginate: Paginate = {
      page_size: 100,
      page_number: 1
    }
    getNotifications.mutate({ paginate })
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const notifications: INotification[] = R.pathOr<INotification[]>([], [], data)

  const onClickNotification = (notification: INotification, msg: NotificationMsg) => {
    handleDropdownClose()
    const newNotification: NotificationData = {
      ...notification.data,
      is_read: true
    }
    updateNotification.mutateAsync({ notificationID: notification._id, params: newNotification })
    if (!R.isNil(msg.linkto)) {
      router.push(msg.linkto)
    }
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
          </Box>
        </MenuItem>
        {isLoading ? (
          <CircularProgress size={40} color='primary' />
        ) : R.isEmpty(notifications) ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              minHeight: 300
            }}
          >
            <Typography sx={{ fontWeight: 600 }} color='secondary'>
              ยังไม่มีข้อความ
            </Typography>
          </Box>
        ) : (
          <ScrollWrapper>
            {notifications.map(n => {
              const msg = getNotificationMsg(n)

              return (
                <MenuItem
                  onClick={() => onClickNotification(n, msg)}
                  key={n._id}
                  sx={{ backgroundColor: !n.data.is_read ? '#74B3CE' : null }}
                >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Avatar alt='Flora' src='/images/avatars/4.png' />
                    <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                      <MenuItemTitle>{msg.title}</MenuItemTitle>
                      <MenuItemSubtitle variant='body2'>{msg.description}</MenuItemSubtitle>
                    </Box>
                    <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                      {formatDistance(new Date(), new Date(n.created_at))}
                    </Typography>
                  </Box>
                </MenuItem>
              )
            })}
          </ScrollWrapper>
        )}
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
