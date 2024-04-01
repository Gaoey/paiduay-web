// ** MUI Imports

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import

// ** Demo Components Imports
import { Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { ReactNode } from 'react'
import UserLayout from 'src/layouts/UserLayout'
import LandingPage from 'src/pages/pages/landing/LandingPage'

const Main = () => {
  return <LandingPage />
}

Main.getLayout = (page: ReactNode) => <div>{page}</div>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default Main
