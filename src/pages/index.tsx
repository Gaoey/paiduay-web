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
  try {
    const session = await getSessionFromCookie(ctx)

    return {
      props: {
        session
      }
    }
  } catch (error) {
    return { props: { error: 'Failed to get sessions' } }
  }
}

export default Main
