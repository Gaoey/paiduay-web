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
        {/* Add meta tags for description, SEO, etc. */}
      </Head>

      {/* (1) Top Menu Bar */}

      <MainContentWrapper className='layout-content-wrapper'>
        {/* AppBar Component */}
        <AppBar>
          <div style={{ backgroundColor: '#3B534A', width: '100vw', padding: '0 2em 0 2em', overflow: 'hidden' }}>
            <Toolbar disableGutters>
              {/* Logo */}
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <Link href='/' passHref>
                  <StyledLink sx={{ color: 'white', fontFamily: 'Itim' }}>{themeConfig.templateName}</StyledLink>
                </Link>
              </Typography>

              {/* Navigation Links */}
              <nav>
                {/* <Link href='/trip-leader' passHref>
            <Button color='inherit'>Trip Leader</Button>
          </Link> */}
              </nav>

              {/* Login Button (Right Aligned) */}
              {isLogin ? (
                <UserDropdown />
              ) : (
                <Button color='inherit' sx={{ ml: 'auto' }} onClick={() => router.push('/pages/login')}>
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
