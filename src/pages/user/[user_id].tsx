import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UserLayout from 'src/layouts/UserLayout'
import UserProfileForm from 'src/views/user/UserProfileForm'

export default function UserProfileDetail() {
  const router = useRouter()
  const userID = router.query.user_id as string

  return (
    <ApexChartWrapper>
      <UserProfileForm userID={userID} />
    </ApexChartWrapper>
  )
}

UserProfileDetail.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
