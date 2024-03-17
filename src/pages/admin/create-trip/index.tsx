// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Icons Imports

// ** Demo Tabs Imports

// ** Third Party Styles Imports
import { getSession } from 'next-auth/react'
import 'react-datepicker/dist/react-datepicker.css'
import { SubmitHandler } from 'react-hook-form'
import AdminLayout from 'src/layouts/AdminLayout'
import TripForm from 'src/views/admin/TripForm'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CreateTrip = () => {
  const onSubmit: SubmitHandler<any> = async data => {
    console.log({ data })
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TripForm onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

CreateTrip.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}

export default CreateTrip
