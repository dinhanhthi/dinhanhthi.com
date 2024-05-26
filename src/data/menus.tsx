import FaGithub from '@notion-x/src/icons/FaGithub'

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
    name: 'Home',
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
    name: 'Projects',
    uri: '/projects/'
  }
]

export const HIDDEN_MENUS: MenuType[] = [
  {
    name: 'Tools',
    uri: '/tools/'
  },
  {
    name: 'Bookmarks',
    uri: '/bookmarks/'
  },
  {
    name: 'Reading',
    uri: '/reading/'
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
