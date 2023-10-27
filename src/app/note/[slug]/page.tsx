import { getUnofficialPosts } from '@/src/app/lib/fetcher'
import SinglePostTemplate from '@/src/app/templates/SinglePostTemplate'
import { DynamicSegmentParamsProps } from '@notion-x/src/interface'
import { getJoinedRichText } from '@notion-x/src/lib/helpers'
import { notionX } from '@notion-x/src/lib/notionx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMetadata } from '../../lib/helpers'

export const revalidate = 20

export async function generateMetadata({ params }: DynamicSegmentParamsProps): Promise<Metadata> {
  const slug = params.slug || ''
  const untitled = 'Unknown note | Site of Thi'
  if (!slug) return { title: untitled }
  const allPosts = await getUnofficialPosts()
  const post = allPosts.find(post => post.slug === slug)
  if (!post) return { title: untitled, description: undefined }

  return getMetadata({
    title: post.title,
    description: getJoinedRichText(post.excerpt)
  })
}

export async function generateStaticParams() {
  const allPosts = await getUnofficialPosts()
  const params = allPosts.filter(post => post.slug).map(post => ({ slug: post.slug }))
  return params
}

export default async function SingleNotePage({ params }: DynamicSegmentParamsProps) {
  const slug = params.slug || ''
  console.debug(`\n👉 slug:  ${slug}`)
  if (!slug) notFound()

  try {
    const allPosts = await getUnofficialPosts()
    const post = allPosts.find(post => post.slug === slug)
    const pageIdwithDash = post?.id
    console.log(`👉 pageIdwithDash: `, pageIdwithDash) // ###M
    if (!pageIdwithDash) notFound()

    const recordMap = await notionX.getPage(pageIdwithDash)

    return <SinglePostTemplate recordMap={recordMap} />
  } catch (error) {
    console.log('🚨Error when loading a single note page', error)
    notFound()
  }
}
