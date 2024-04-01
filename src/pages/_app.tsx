// ** Next Imports
import type { NextPage } from 'next'
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import type { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import APIProvider from 'src/@core/context/apiContext'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import * as R from 'ramda'
import { Session } from 'next-auth'
import { ParallaxProvider } from 'react-scroll-parallax'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <BlankLayout>{page}</BlankLayout>)

  const session = R.pathOr<Session | null>(null, ['session'], pageProps)

  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={session}>
        <QueryClientProvider client={new QueryClient()}>
          <APIProvider>
            <ParallaxProvider>
              <Head>
                <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
                <meta
                  name='description'
                  content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
                />
                <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
                <meta name='viewport' content='initial-scale=1, width=device-width' />
              </Head>

              <SettingsProvider>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </ParallaxProvider>
          </APIProvider>
        </QueryClientProvider>
      </SessionProvider>
    </CacheProvider>
  )
}

export default App
