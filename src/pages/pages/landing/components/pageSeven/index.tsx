import dynamic from 'next/dynamic'
import * as React from 'react'

type agent = {
  isDesktop?: boolean
  isAndroid?: boolean
  isBot?: boolean
  isIos?: boolean
  isIpad?: boolean
  isIphone?: boolean
  isMac?: boolean
  isMobile?: boolean
  isTablet?: boolean
  isFirefox?: boolean
  isIE?: boolean
  isChrome?: boolean
  isSafari?: boolean
  isChromeOS?: boolean
  isWindows?: boolean
}

const CTXAgent = React.createContext<agent>({} as agent)

const useLayout = (): agent => {
  const context = React.useContext(CTXAgent)
  if (!context) {
    throw new Error('useLayout must be used within an CTXAgent.Provider')
  }

  return context
}

const DesktopContent = dynamic(() => import('./desktop'), { ssr: false })
const MobileContent = dynamic(() => import('./mobile'), { ssr: false })

const Footer = () => {
  const { isDesktop } = useLayout()

  return isDesktop ? <DesktopContent /> : <MobileContent />
}

export default Footer
