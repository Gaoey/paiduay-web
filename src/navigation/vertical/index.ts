// ** Icon imports
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/admin/dashboard'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/admin/account-settings'
    },
    {
      sectionTitle: 'Trips'
    },
    {
      title: 'Trip Lists',
      icon: AccountCogOutline,
      path: '/admin/trip-list'
    },
    {
      title: 'Create a Trip',
      icon: AccountCogOutline,
      path: '/admin/create-trip'
    },
    {
      sectionTitle: 'Membership'
    },
    {
      title: 'Payment Status',
      icon: AccountCogOutline,
      path: '/admin/payment-status'
    },
    {
      title: 'Member details',
      icon: AccountCogOutline,
      path: '/admin/member-details'
    }
  ]
}

export default navigation
