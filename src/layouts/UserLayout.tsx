// ** React Imports
import { ReactNode } from 'react'

import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { Head } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useApi } from 'src/@core/services'

import Link from 'next/link'
import { StyledLink } from 'src/@core/layouts/components/vertical/navigation/VerticalNavHeader'
import themeConfig from 'src/configs/themeConfig'
import { ContentWrapper, MainContentWrapper } from 'src/@core/layouts/VerticalLayout'

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

      <MainContentWrapper className='layout-content-wrapper' >
        <AppBar sx={{ boxShadow: 'none' }}>
          <div style={{ backgroundColor: '#FDECEF', width: '100vw', padding: '0 2em 0 2em', overflow: 'hidden', maxHeight: '4em'}}>
            <Toolbar disableGutters>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <Link href='/' passHref>
                  <StyledLink sx={{ color: '#3B5249', fontFamily: 'Itim' }}>{themeConfig.templateName}</StyledLink>
                </Link>
              </Typography>

              {isLogin ? (
                <UserDropdown />
              ) : (
                <Button color='primary' sx={{ ml: 'auto' }} onClick={() => router.push('/pages/login')}>
                  Login
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
      </MainContentWrapper>
    </div>
  )
}

export default UserLayout
