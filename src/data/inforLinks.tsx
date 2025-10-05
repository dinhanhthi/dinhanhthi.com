import { BadgeInfosProps } from '@/src/app/components/BadgeInfos'
import cn from 'classnames'

import me from './me'

export const inforLinks: BadgeInfosProps[] = [
  {
    id: 'contact',
    url: `mailto:${me.email}`,
    title: 'Contact',
    external: true,
    className: cn(
      'border-none bg-sky-500 px-7 font-normal text-white hover:bg-sky-600 md:shadow-sky-100'
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
