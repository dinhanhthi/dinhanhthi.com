import { BadgeInfosProps } from '@/src/app/components/BadgeInfos'

import me from './me'

export const inforLinks: BadgeInfosProps[] = [
  {
    id: 'contact',
    url: `mailto:${me.email}`,
    title: 'Email',
    icon: 'Mail',
    external: true,
    targetSelf: true
  },
  {
    id: 'cv',
    url: '/about/',
    title: 'About',
    icon: 'UserRound'
  },
  {
    id: 'sketches',
    url: 'https://photos.app.goo.gl/9OVEkdTjmtRPg7vC3',
    title: 'Sketch',
    icon: 'Palette',
    external: true
  },
  {
    id: 'reading',
    url: '/reading/',
    title: 'Read',
    icon: 'BookOpen'
  },
  {
    id: 'cook',
    url: 'https://goo.gl/photos/yQXdQws1LLS16x5v5',
    title: 'Cook',
    icon: 'ChefHat',
    external: true
  }
]

export default inforLinks
