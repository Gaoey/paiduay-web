import { AlternateEmail } from '@mui/icons-material'
import { Avatar, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import * as R from 'ramda'
import { Profiler } from 'src/@core/types/profiler'
import { trimMessage } from 'src/@core/utils/string'

interface ProfilerCardProps {
  profiler: Profiler
}
export default function ProfilerCard(props: ProfilerCardProps) {
  const { profiler } = props

  return (
    <Card>
      <CardHeader
        avatar={
          !R.isNil(profiler?.data?.logo_image?.signed_url) ? (
            <Avatar src={profiler?.data?.logo_image?.signed_url || ''} />
          ) : (
            <Avatar>{profiler?.data?.name[0]}</Avatar>
          )
        }
        title={profiler?.data?.name}
      />

      <CardContent>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            {profiler?.data?.contacts.map((v, id) => {
              return (
                <div style={{ display: 'flex' }} key={id}>
                  <AlternateEmail style={{ color: '#3B5249' }} />
                  <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                    {v.contact_type}
                  </Typography>
                  <a href={v.link} rel='noopener noreferrer' target='_blank'>
                    <Typography variant='body2' color='text.secondary' style={{ paddingLeft: '0.5em' }}>
                      {trimMessage(v.link, 50)}
                    </Typography>
                  </a>
                </div>
              )
            })}

            <Typography variant='body2' color='text.secondary' style={{ marginTop: 10 }}>
              {trimMessage(profiler?.data?.description, 1000)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
