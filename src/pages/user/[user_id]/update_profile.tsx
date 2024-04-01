import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UserLayout from 'src/layouts/UserLayout'
import UpdateProfileForm from 'src/views/user/UpdateUserProfileForm'
import * as R from 'ramda'
import { useApi } from 'src/@core/services'
import { User } from 'src/@core/types/user'

export default function UpdateProfile() {
  const router = useRouter()
  const userID = router.query.user_id as string

  const { userAPI } = useApi()
  const { getUserById } = userAPI

  const { data } = getUserById
  const user: User | undefined = R.pathOr<User | undefined>(undefined, [], data)

  useEffect(() => {
    getUserById.mutate(userID)
  }, [])

  return <ApexChartWrapper>{!R.isNil(user) && <UpdateProfileForm user={user} />}</ApexChartWrapper>
}

UpdateProfile.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
