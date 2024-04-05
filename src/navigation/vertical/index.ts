// ** Icon imports
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import List from '@mui/icons-material/List'

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
      title: 'โปรไฟล์ทริปลีดเดอร์',
      icon: AccountCogOutline,
      path: '/admin/profiler-settings'
    },
    {
      sectionTitle: 'ทริป'
    },
    {
      title: 'ทริปของคุณ',
      icon: List,
      path: '/admin/trip-list'
    },

    // {
    //   title: 'Trip History',
    //   icon: AccountCogOutline,
    //   path: '/admin/trip-history'
    // },
    {
      title: 'สร้างทริป',
      icon: AddCircleOutline,
      path: '/admin/create-trip'
    }

    // {
    //   sectionTitle: 'Membership'
    // }

    // {
    //   title: 'Member details',
    //   icon: AccountCogOutline,
    //   path: '/admin/member-details'
    // }
  ]
}

export default navigation
