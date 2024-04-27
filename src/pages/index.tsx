// ** MUI Imports

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import

// ** Demo Components Imports
import { getSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useApi } from 'src/@core/services'
import UserLayout from 'src/layouts/UserLayout'
import LandingPage from 'src/pages/pages/landing/LandingPage'

const Main = () => {
  console.log(process.env.CORE_SERVER_API)
  const { userAPI } = useApi()
  const { healthcheck } = userAPI
  useEffect(() => {
    healthcheck.mutate()
  }, [])

  const { isSuccess, isError } = healthcheck

  useEffect(() => {
    if (isSuccess) {
      console.log('ping server success')
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      console.log('ping server error')
    }
  }, [isError])

  return <LandingPage />
}

Main.getLayout = (page: ReactNode) => <UserLayout isContentWrap={false}>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default Main
