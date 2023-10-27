import FaGithub from '@notion-x/src/icons/FaGithub'
import GrCircleInformation from '@notion-x/src/icons/GrCircleInformation'
import ImPencil2 from '@notion-x/src/icons/ImPencil2'
import RiHome2Line from '@notion-x/src/icons/RiHome2Line'
import TiTag from '@notion-x/src/icons/TiTag'

import me from './me'

export type MenuType = {
  name: string
  uri: string
  icon?: any
}

export const MenuAbout = {
  name: 'About',
  uri: '/about/',
  icon: GrCircleInformation
}

export const MENUS: MenuType[] = [
  {
    name: 'Home',
    uri: '/',
    icon: RiHome2Line
  },
  MenuAbout,
  {
    name: 'Notes',
    uri: '/notes/',
    icon: ImPencil2
  },
  {
    name: 'Topics',
    uri: '/tags/',
    icon: TiTag
  },
  {
    name: 'Projects',
    uri: '/projects/',
    icon: FaGithub
  },
  {
    name: 'Tools',
    uri: '/tools/'
  }
]

export const MenuGithub = {
  name: 'Github',
  path: me.github,
  icon: FaGithub,
  external: true,
  hideOnDesktop: true,
  hide: true
}
