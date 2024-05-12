// ** MUI Imports

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import

// ** Demo Components Imports
import { ReactNode } from 'react'
import { getSessionFromCookie } from 'src/@core/utils/session'
import UserLayout from 'src/layouts/UserLayout'
import LandingPage from 'src/pages/pages/landing/LandingPage'

const Main = () => {
  return <LandingPage />
}

Main.getLayout = (page: ReactNode) => <UserLayout isContentWrap={false}>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSessionFromCookie(ctx)

  return {
    props: {
      session
    }
  }
}

export default Main
