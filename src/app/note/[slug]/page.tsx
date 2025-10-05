import { getCustomEmojiUrl, getTopics, getUnofficialPosts } from '@/src/lib/fetcher'
import SinglePostTemplate from '@/src/app/templates/SinglePostTemplate'
import { DynamicSegmentParamsProps } from '@/src/lib/notion/interface'
import { getJoinedRichText } from '@/src/lib/notion/helpers'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPage } from '@/src/lib/notion/notionx'
import { getMetadata, transformUnofficialPostProps } from '@/src/lib/helpers'
import DiscretePostTemplate from '../../templates/DiscretePostTemplate'

export const revalidate = 20

export async function generateMetadata({ params }: DynamicSegmentParamsProps): Promise<Metadata> {
  const slug = params.slug || ''
  const untitled = 'Unknown note | Site of Thi'
  if (!slug) return { title: untitled }
  const allPosts = await getUnofficialPosts()
  const post = allPosts.find(post => post.slug === slug)
  if (!post) return { title: untitled, description: undefined }

  const title = post.title
  const description = getJoinedRichText(post.excerpt)

  return getMetadata({
    title,
    description,
    images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
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
    const topics = await getTopics()
    const post = allPosts.find(post => post.slug === slug)
    const pageIdwithDash = post?.id
    console.log(`👉 pageIdwithDash: ${pageIdwithDash} and title: "${post?.title}"`) // ###M
    if (!pageIdwithDash) notFound()

    const recordMap = await getPage(pageIdwithDash)
    // saveObjectToFile(recordMap, 'output.txt').catch(console.error);
    // const recordMap = await loadObjectFromFile('output.txt')

    const id = Object.keys(recordMap.block)[0]
    const block = recordMap.block[id]?.value
    const postProps = transformUnofficialPostProps(block, topics, recordMap)

    // for new custom emoji
    if (postProps?.icon?.startsWith('notion://custom_emoji')) {
      const customEmojiId = postProps.icon.split('/').pop()
      if (customEmojiId) {
        const customEmojiUrl = await getCustomEmojiUrl(customEmojiId)
        postProps.customEmojiUrl = customEmojiUrl ?? postProps.icon
      }
    }

    if (postProps.discrete)
      return <DiscretePostTemplate recordMap={recordMap} postProps={postProps} />

    return <SinglePostTemplate recordMap={recordMap} postProps={postProps} />
  } catch (error) {
    console.log('🚨Error when loading a single note page', error)
    notFound()
  }
}
