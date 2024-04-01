// ** React Imports
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'

import * as R from 'ramda'
import { useAPICtx } from 'src/@core/hooks/useAPICtx'
import { useApi } from 'src/@core/services'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

export function useAdminAccount() {
  const { userAPI } = useApi()
  const { user } = userAPI

  const { accessToken } = useAPICtx()
  const { data: currentUser, ...props } = user

  useEffect(() => {
    if (!R.isEmpty(accessToken)) {
      user.mutate()
    }
  }, [accessToken])

  const isAdmin = R.pathOr(false, ['profile', 'trip_maker_role'], currentUser)

  return {
    ...props,
    isAdmin,
    user: currentUser
  }
}

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()

  const { user, isSuccess, isAdmin } = useAdminAccount()

  // ** Effects
  useEffect(() => {
    if (isSuccess && !isAdmin) {
      router.push('/admin/create-profiler')
    }
  }, [isAdmin, isSuccess, router])

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='Profile pic'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={user?.profile_image || '/images/avatars/1.png'}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 300, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt='profile img'
                src={user?.profile_image || '/images/avatars/1.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {isAdmin ? 'TRIP MAKER' : 'USER'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        {isAdmin && (
          <MenuItem sx={{ p: 0 }} onClick={() => router.push('/admin/dashboard')}>
            <Box sx={styles}>
              <AccountOutline sx={{ marginRight: 2 }} />
              Admin Dashboard
            </Box>
          </MenuItem>
        )}
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Booking history
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <MessageOutline sx={{ marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem> */}
        <Divider />
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem> */}
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            Term & Conditions
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose('/pages/login')}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
