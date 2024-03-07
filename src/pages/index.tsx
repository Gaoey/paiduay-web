// ** MUI Imports

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import

// ** Demo Components Imports
import { Typography } from '@mui/material'
import { ReactNode } from 'react'
import UserLayout from 'src/layouts/UserLayout'

const Dashboard = () => {
  return <Typography>Main</Typography>
}

Dashboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export default Dashboard
