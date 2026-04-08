import SinglePostTemplate from '@/src/app/templates/SinglePostTemplate'
import { getCustomEmojiUrl, getRecordMap, getTopics, getUnofficialPosts } from '@/src/lib/fetcher'
import { getJoinedRichText } from '@/src/lib/helpers'
import { DynamicSegmentParamsProps } from '@/src/lib/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMetadata, transformUnofficialPostProps } from '@/src/lib/helpers'

export const dynamicParams = false

const MAX_RETRIES = 2
const MAX_SKIPPED_PAGES = 10
let skippedPages = 0

export async function generateStaticParams() {
  const allPosts = await getUnofficialPosts({
    whoIsCalling: 'note/[slug]/page.tsx/generateStaticParams'
  })
  return allPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: DynamicSegmentParamsProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug || ''
  const untitled = 'Unknown note | Site of Thi'
  if (!slug) return { title: untitled }
  const allPosts = await getUnofficialPosts({
    whoIsCalling: 'note/[slug]/page.tsx/generateMetadata',
    uri: `https://dinhanhthi.com/note/${slug}/`
  })
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

async function renderNotePage(slug: string) {
  const allPosts = await getUnofficialPosts({
    whoIsCalling: `note/[slug]/page.tsx/SingleNotePage (slug: ${slug})`,
    uri: `https://dinhanhthi.com/note/${slug}/`
  })
  const topics = await getTopics({
    whoIsCalling: `note/[slug]/page.tsx/SingleNotePage (slug: ${slug})`,
    uri: `https://dinhanhthi.com/note/${slug}/`
  })
  const post = allPosts.find(post => post.slug === slug)
  const pageIdwithDash = post?.id
  console.log(`👉 pageIdwithDash: ${pageIdwithDash} and title: "${post?.title}"`)
  if (!pageIdwithDash) notFound()

  const recordMap = await getRecordMap(pageIdwithDash)

  const id = Object.keys(recordMap.block)[0]
  const block = recordMap.block[id]?.value
  const postProps = transformUnofficialPostProps(block, topics)

  // for new custom emoji
  if (postProps?.icon?.startsWith('notion://custom_emoji')) {
    const customEmojiId = postProps.icon.split('/').pop()
    if (customEmojiId) {
      const customEmojiUrl = await getCustomEmojiUrl(pageIdwithDash, customEmojiId)
      postProps.customEmojiUrl = customEmojiUrl ?? postProps.icon
    }
  }

  return <SinglePostTemplate recordMap={recordMap} postProps={postProps} />
}

export default async function SingleNotePage({ params }: DynamicSegmentParamsProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || ''
  console.debug(`\n👉 slug:  ${slug}`)
  if (!slug) notFound()

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await renderNotePage(slug)
    } catch (error: any) {
      // Re-throw Next.js navigation errors (notFound, redirect) as-is
      if (error?.digest?.includes('NEXT_NOT_FOUND') || error?.digest?.includes('NEXT_REDIRECT')) {
        throw error
      }

      console.log(`🚨 [Attempt ${attempt}/${MAX_RETRIES}] Error rendering /note/${slug}:`, error)
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying /note/${slug}...`)
        continue
      }

      skippedPages++
      console.log(
        `⚠️ Skipping /note/${slug} after ${MAX_RETRIES} failed attempts (${skippedPages} skipped so far)`
      )

      if (skippedPages > MAX_SKIPPED_PAGES) {
        throw new Error(
          `Build aborted: too many skipped pages (${skippedPages} > ${MAX_SKIPPED_PAGES}). Last failure: /note/${slug}`
        )
      }

      notFound()
    }
  }

  notFound()
}
