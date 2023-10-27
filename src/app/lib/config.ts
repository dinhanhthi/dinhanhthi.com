import { PostTypeOpts } from '@notion-x/src/components/PostsList'

import { poppins } from './fonts'

export const defaultBlurDataURL = `data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwC
  AAAAC0lEQVR42mN8XA8AAksBZG7LpHYAAAAASUVORK5CYII=`

export const containerNormal = 'max-w-4xl'
export const containerWide = 'xl:max-w-6xl'
export const bodyPadding = 'py-12'

export const defaultPostTitle = 'Untitled'

export const defaultPostDate = new Date().toISOString().split('T')[0]

export const defaultPostTypeOpts: PostTypeOpts = {
  fontClassName: poppins.className,
  newLabel: 'new',
  updatedLabel: 'updated',
  humanizeDate: true,
  maxDaysWinthin: 10
}
