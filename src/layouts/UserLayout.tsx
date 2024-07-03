// ** React Imports
import { ReactNode } from 'react'

import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { Head } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'

import Link from 'next/link'
import { ContentWrapper, MainContentWrapper } from 'src/@core/layouts/VerticalLayout'
import themeConfig from 'src/configs/themeConfig'
import Footer from 'src/pages/pages/landing/components/pageSeven'

interface Props {
  children: ReactNode
  isContentWrap?: boolean
}

const UserLayout = ({ children, isContentWrap = true }: Props) => {
  const router = useRouter()
  const { userAPI } = useApi()

  const { isLogin } = userAPI

  return (
    <div>
      <Head>
        <title>Headache-Free Trip Manager</title>
      </Head>

      <MainContentWrapper className='layout-content-wrapper'>
        <AppBar sx={{ boxShadow: 'none' }}>
          <div
            style={{
              backgroundColor: '#FDECEF',
              width: '100vw',
              padding: '0 2em 0 1em',
              overflow: 'hidden',
              maxHeight: '4em'
            }}
          >
            <Toolbar disableGutters>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <Link href='/' passHref>
                  <img src='/images/logo-horizontal.png' alt={themeConfig.templateName} style={{ height: '50px' }} />
                </Link>
              </Typography>

              {isLogin ? (
                <UserDropdown />
              ) : (
                <Button color='primary' sx={{ ml: 'auto' }} onClick={() => router.push('/pages/login')}>
                  Sign In
                </Button>
              )}
            </Toolbar>
          </div>
        </AppBar>

        {/* Content */}
        {isContentWrap ? (
          <ContentWrapper className='layout-page-content' sx={{ marginTop: 10 }}>
            {children}
          </ContentWrapper>
        ) : (
          <>{children}</>
        )}
        <Footer />
      </MainContentWrapper>
    </div>
  )
}

export default UserLayout
