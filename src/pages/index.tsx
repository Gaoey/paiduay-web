// ** MUI Imports

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import

// ** Demo Components Imports
import { Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { ReactNode } from 'react'
import UserLayout from 'src/layouts/UserLayout'

const Main = () => {
  return <Typography>Main</Typography>
}

Main.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default Main
