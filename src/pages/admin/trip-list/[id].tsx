import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'

export default function TripDetail() {
  const router = useRouter()

  return (
    <div>
      <p>Post: {router.query.id}</p>
    </div>
  )
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
