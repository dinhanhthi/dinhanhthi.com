import { notionX } from '@notion-x/src/lib/notionx'
import { notFound } from 'next/navigation'
import { parsePageId } from 'notion-utils'

import { getMetadata } from '../../lib/helpers'
import SinglePostTemplate from '../../templates/SinglePostTemplate'

export const revalidate = 20

export const metadata = getMetadata({
  title: 'Support Thi'
})

export default async function SupportThiPage() {
  try {
    const recordMap = await notionX.getPage(parsePageId(process.env.SUPPORT_ME as string))
    return <SinglePostTemplate hideMeta={true} recordMap={recordMap} />
  } catch (error) {
    console.log('🚨Error when loading Support Thi page', error)
    notFound()
  }
}
