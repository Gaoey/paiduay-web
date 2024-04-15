import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { ReactNode, useEffect, useState } from 'react'
import { useApi } from 'src/@core/services'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Transport, Transportation } from 'src/@core/types/transport'
import UserLayout from 'src/layouts/UserLayout'
import { TransportationNormalBookingForm, VanBookingForm } from 'src/views/user/TransportationForm'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
export default function BookingTrip() {
  const router = useRouter()
  const tripID = router.query.trip_id as string

  const { transportAPI } = useApi()

  const { findTransportByTripID } = transportAPI
  const { data } = findTransportByTripID
  const transports = R.pathOr<Transport[]>([], [], data)

  const [tab, setTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  useEffect(() => {
    findTransportByTripID.mutate(tripID)
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={7}>
        <Grid item md={12} xs={12}>
          <Typography variant='h4' sx={{ textAlign: 'center' }}>
            จองที่นั่งเดินทาง
          </Typography>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChange} aria-label='select transport tab'>
              {!R.isEmpty(transports) &&
                transports.map((item, index) => {
                  return <Tab key={index} label={item.data.name} {...a11yProps(0)} />
                })}
            </Tabs>
          </Box>
        </Grid>
        <Grid item md={12}>
          {!R.isEmpty(transports) &&
            transports.map((item, index) => {
              if (item.data.transport_by === Transportation[Transportation.VAN]) {
                return (
                  <CustomTabPanel value={tab} index={index} key={item._id}>
                    <VanBookingForm values={item.data.seats} tripID={tripID} transportID={item._id} />
                  </CustomTabPanel>
                )
              } else {
                return (
                  <CustomTabPanel value={tab} index={index} key={item._id}>
                    <TransportationNormalBookingForm
                      key={item._id}
                      values={item.data.seats}
                      tripID={tripID}
                      transportID={item._id}
                    />
                  </CustomTabPanel>
                )
              }
            })}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

BookingTrip.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
