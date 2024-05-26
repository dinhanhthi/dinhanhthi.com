import { BadgeInfosProps } from '@notion-x/src/components/BadgeInfos'
import cn from 'classnames'

import me from './me'

export const inforLinks: BadgeInfosProps[] = [
  {
    id: 'contact',
    url: `mailto:${me.email}`,
    title: 'Contact',
    external: true,
    className: cn(
      'px-7 md:shadow-sky-100 font-normal bg-sky-500 border-none hover:bg-sky-600 text-white'
    ),
    targetSelf: true
  },
  {
    id: 'cv',
    url: '/about/',
    title: 'My CV',
    icon: '📋'
  },
  {
    id: 'sketches',
    url: 'https://photos.app.goo.gl/9OVEkdTjmtRPg7vC3',
    title: 'My Sketches',
    icon: '🎨',
    external: true
  },
  {
    id: 'reading',
    url: '/reading/',
    title: 'Reading list',
    icon: '📚'
  },
  {
    id: 'cook',
    url: 'https://goo.gl/photos/yQXdQws1LLS16x5v5',
    title: 'Cooking',
    icon: '🍲',
    external: true
  }
]

export default inforLinks
