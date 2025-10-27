import FaGithub from '@/src/app/icons/FaGithub'

import me from './me'

export type MenuType = {
  name: string
  uri: string
  icon?: any
}

export const MenuAbout = {
  name: 'About',
  uri: '/about/'
}

export const MENUS: MenuType[] = [
  {
    name: 'Thi Notes',
    uri: '/'
  },
  MenuAbout,
  {
    name: 'Notes',
    uri: '/notes/'
  },
  {
    name: 'Blog',
    uri: '/blogs/'
  },
  {
    name: 'Topics',
    uri: '/tags/'
  },
  {
    name: 'Tools',
    uri: '/tools/'
  },
  {
    name: 'Reading',
    uri: '/reading/'
  }
]

export const HIDDEN_MENUS: MenuType[] = []

export const MenuGithub = {
  name: 'Github',
  path: me.github,
  icon: FaGithub,
  external: true,
  hideOnDesktop: true,
  hide: true
}
