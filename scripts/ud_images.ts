import { getBlocks, queryDatabase, retrievePage } from '@/src/lib/notion/db'
import { makeSlugText } from '@/src/lib/notion/helpers'
import { Client } from '@notionhq/client'
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import chalk from 'chalk'
import cloudinary from 'cloudinary'
import { get } from 'lodash'
import yargs, * as yargsType from 'yargs'

import { NotionHeader, NotionPost } from '../src/interface'

// --------------------------------------------------------------------------------------------
// How to use?
// npx tsx -r dotenv/config ./scripts/ud_images.ts dotenv_config_path=.env.local --a images-in-post --pid <postId>
// --------------------------------------------------------------------------------------------

// Notion
const notionClient = new Client({ auth: process.env.NOTION_TOKEN })
const dbId = process.env.NOTION_DB_POSTS as string

// Cloudinary
const albumCover = 'dat.com-post-covers'
const albumIcons = 'dat.com-post-icons'
const albumPostImages = 'dat.com-post-images'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true
})

async function main(argv: yargsType.Argv['argv']) {
  const { a, pid } = argv as never
  switch (a) {
    case 'cover': {
      await updateCover(pid)
      break
    }

    case 'icon': {
      await updateIcon(pid)
      break
    }

    case 'cover-all': {
      await updateCoverAll()
      break
    }

    case 'icon-all': {
      await updateIconAll()
      break
    }

    case 'images-in-post': {
      await updateImagesInPost(pid)
      break
    }
  }
}

const argv = yargs(process.argv.slice(2))
main(argv.argv)

async function updateImagesInPost(postId: string) {
  console.log(chalk.blue(`🌶 Update Image Blocks for post id ${postId}`))
  if (!postId) return handleError('Missing post id', 'updateImagesInPost()')

  console.log(chalk.yellow('⧗ Checking and downloading image from Notion...'))
  const { postTitle, firstTag } = await getNotionHeader(postId)
  const blocks = await getBlocks(postId)
  const flatBlocks = flattenAllBlocks(blocks)
  const imageBlocks = flatBlocks.filter((block: any) => 'type' in block && block.type === 'image')

  if (!imageBlocks || !imageBlocks?.length) {
    return handleError('There is no image block', 'updateImagesInPost()')
  }

  const blockImages = getBlockImageInfo(imageBlocks, postTitle, firstTag)
  const imgs = blockImages.filter(img => !ignoreImage(img.fileUrl))
  console.log(chalk.blue(`\n### There are ${imgs.length} images to be downloaded.`))

  for (const img of imgs) {
    await processUpdateImagesInPost({
      blockId: img.blockId,
      fileUrl: img.fileUrl,
      postTitle: img.title,
      firstTag: img.firstTag
    })
  }
}

function getBlockImageInfo(blocks: any[], postTitle: string, firstTag: string) {
  const blockImages = []
  for (const block of blocks) {
    const blockId = block.id
    const title = getJoinedRichText(block?.image?.caption) || postTitle
    const fileUrl = get(block, 'image.file.url') || get(block, 'image.external.url') || null
    blockImages.push({ blockId, title, fileUrl, firstTag })
  }

  return blockImages
}

async function processUpdateImagesInPost(options: {
  blockId: string
  fileUrl: string
  postTitle: string
  firstTag: string
}) {
  const { blockId, fileUrl, postTitle, firstTag } = options
  console.log('\n+++')
  console.log('----> notionUrl: ', fileUrl)
  console.log('----> postTitle: ', postTitle)

  if (ignoreImage(fileUrl)) {
    console.log(chalk.green('✓ No action needed!'))
    return
  }

  const folder = `${albumPostImages}/${firstTag}`
  console.log(chalk.yellow(`⧗ Uploading image to "${folder}"...`))
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(fileUrl, {
      folder,
      public_id: makeSlugText(postTitle) + '-' + Date.now(),
      transformation: {
        width: 1500
      }
    })
    console.log(chalk.green('✓ Done!'))
    console.log('----> Cloudinary URL: ', secure_url)

    console.log(chalk.yellow(`⧗ Modifying IMAGE IN POST on Notion...`))
    try {
      await updateNotionBlockImage(blockId, secure_url)
      console.log(chalk.green('✓ Done!'))
    } catch (error) {
      console.log(chalk.red('🚩 Cannot update image on Notion!'))
      console.log(chalk.yellow('⧗ Deleting image from Cloudinary...'))
      const ok = await deleteImageFromCloudinary(public_id)
      if (ok) console.log(chalk.green('✓ Done!'))
      else console.log(chalk.red('🚩 Cannot delete image from Cloudinary!'))
      throw error
    }
  } catch (error) {
    return handleError(JSON.stringify(error), 'processUpdateImagesInPost()')
  }
}

async function updateNotionBlockImage(blockId: string, imgurUrl: string) {
  const response: unknown = await notionClient.blocks.update({
    block_id: blockId,
    image: {
      external: {
        url: imgurUrl
      }
    }
  })

  return response
}

function flattenAllBlocks(blocks: any[]): any {
  const childBlocks = blocks
    .filter(block => 'has_children' in block && block.has_children)
    .map((block: any) => {
      const nestedChildren = flattenAllBlocks(block['children'])
      return nestedChildren
    })

  return [...blocks, ...childBlocks.flat()]
}

async function updateCoverAll() {
  console.log(chalk.blue(`🌶 Update COVER for ALL POSTS in database ${dbId}`))
  if (!dbId) return handleError('Missing database id', 'updateCoverAll()')

  console.log(chalk.yellow('⧗ Checking and downloading images from Notion...'))
  const posts = await getPosts()
  for (const post of posts) {
    if (!post?.postId || !post?.coverUrl) continue
    console.log(chalk.magenta(`\n👉 postId: ${post?.postId}`))
    await processUpdateCover({
      postId: post.postId,
      fileUrl: post?.coverUrl,
      postTitle: post?.postTitle
    })
  }
}

async function updateIconAll() {
  console.log(chalk.blue(`🌶 Update ICON for ALL POSTS in database ${dbId}`))
  if (!dbId) return handleError('Missing database id', 'updateIconAll()')

  console.log(chalk.yellow('⧗ Checking and downloading icons from Notion...'))
  const posts = await getPosts()
  for (const post of posts) {
    if (!post?.postId || !post?.iconUrl) continue
    console.log(chalk.magenta(`\n👉 postId: ${post?.postId}`))
    await processUpdateIcon({
      postId: post.postId,
      fileUrl: post?.iconUrl,
      postTitle: post?.postTitle
    })
  }
}

async function getPosts(startCursor?: string) {
  console.log('_____getPosts()....')
  try {
    const data = await queryDatabase({ dbId, startCursor })
    return await transformNotionPostsData(data?.results as any[])
  } catch (error) {
    console.log('🐞 _____getPosts() error: ', error)
    return []
  }
}

async function transformNotionPostsData(data: NotionPost[]) {
  if (!data || !data.length) return []

  return Promise.all(
    data.map(post => {
      const postTitle = getJoinedRichText(get(post, 'properties.Name.title') as any) || 'Untitled'
      const coverUrl = post?.cover?.file?.url || post?.cover?.external?.url
      const iconUrl = post?.icon?.file?.url || post?.icon?.external?.url

      return {
        postId: post.id,
        postTitle,
        coverUrl,
        iconUrl
      }
    })
  )
}

async function updateCover(postId: string) {
  console.log(chalk.blue(`🌶 Update COVER for post id ${postId}`))
  if (!postId) return handleError('Missing post id', 'updateCover()')

  console.log(chalk.yellow('⧗ Checking and downloading image from Notion...'))
  const { postTitle, coverUrl } = await getNotionHeader(postId)
  if (!coverUrl) return handleError('Missing file url', 'updateCover()')
  await processUpdateCover({ postId, fileUrl: coverUrl, postTitle })
}

async function processUpdateCover(options: { postId: string; fileUrl: string; postTitle: string }) {
  const { postId, fileUrl, postTitle } = options

  console.log('----> notionUrl: ', fileUrl)
  console.log('----> postTitle: ', postTitle)

  if (ignoreImage(fileUrl)) {
    console.log(chalk.green('✓ No action needed!'))
    return
  }

  const folder = albumCover
  console.log(chalk.yellow(`⧗ Uploading image to "${folder}"...`))
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(fileUrl, {
      folder,
      public_id: 'COVER-' + makeSlugText(postTitle) + '-' + Date.now(),
      transformation: {
        width: 1800
      }
    })
    console.log(chalk.green('✓ Done!'))
    console.log('----> Cloudinary URL: ', secure_url)

    console.log(chalk.yellow(`⧗ Modifying COVER on Notion...`))
    try {
      await updateNotionCoverImage(postId, secure_url)
      console.log(chalk.green('✓ Done!'))
    } catch (error) {
      console.log(chalk.red('🚩 Cannot update image on Notion!'))
      console.log(chalk.yellow('⧗ Deleting image from Cloudinary...'))
      const ok = await deleteImageFromCloudinary(public_id)
      if (ok) console.log(chalk.green('✓ Done!'))
      else console.log(chalk.red('🚩 Cannot delete image from Cloudinary!'))
      throw error
    }
  } catch (error) {
    return handleError(JSON.stringify(error), 'processUpdateCover()')
  }
}

async function updateIcon(postId: string) {
  console.log(chalk.blue(`🌶 Update ICON for post id ${postId}`))
  if (!postId) return handleError('Missing post id', 'updateIcon()')

  console.log(chalk.yellow('⧗ Checking and downloading icon from Notion...'))
  const { iconUrl, postTitle } = await getNotionHeader(postId)
  if (!iconUrl) return handleError('There is no icon yet or it is an emoji!', 'updateIcon()')
  await processUpdateIcon({ postId, fileUrl: iconUrl, postTitle })
}

async function processUpdateIcon(options: { postId: string; fileUrl: string; postTitle: string }) {
  const { postId, fileUrl, postTitle } = options

  console.log('----> notionUrl: ', fileUrl)
  console.log('----> postTitle: ', postTitle)

  if (ignoreImage(fileUrl)) {
    console.log(chalk.green('✓ No action needed!'))
    return
  }

  const folder = albumIcons
  console.log(chalk.yellow(`⧗ Uploading image to "${folder}"...`))
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(fileUrl, {
      folder,
      public_id: 'ICON-' + makeSlugText(postTitle) + '-' + Date.now(),
      transformation: {
        width: 400
      }
    })
    console.log(chalk.green('✓ Done!'))
    console.log('----> Cloudinary URL: ', secure_url)

    console.log(chalk.yellow(`⧗ Modifying ICON on Notion...`))
    try {
      await updateNotionIconImage(postId, secure_url)
      console.log(chalk.green('✓ Done!'))
    } catch (error) {
      console.log(chalk.red('🚩 Cannot update ICON on Notion!'))
      console.log(chalk.yellow('⧗ Deleting image from Cloudinary...'))
      const ok = await deleteImageFromCloudinary(public_id)
      if (ok) console.log(chalk.green('✓ Done!'))
      else console.log(chalk.red('🚩 Cannot delete image from Cloudinary!'))
      throw error
    }
  } catch (error) {
    return handleError(JSON.stringify(error), 'processUpdateIcon')
  }
}

async function deleteImageFromCloudinary(public_id: string) {
  const { result } = await cloudinary.v2.uploader.destroy(public_id, { invalidate: true })
  return result === 'ok'
}

async function updateNotionIconImage(pageId: string, secure_url: string): Promise<NotionHeader> {
  const response: unknown = await notionClient.pages.update({
    page_id: pageId,
    icon: {
      type: 'external',
      external: {
        url: secure_url
      }
    }
  })

  return response as NotionHeader
}

async function updateNotionCoverImage(pageId: string, secure_url: string): Promise<NotionHeader> {
  const response: unknown = await notionClient.pages.update({
    page_id: pageId,
    cover: {
      type: 'external',
      external: {
        url: secure_url
      }
    }
  })

  return response as NotionHeader
}

function ignoreImage(url: string): boolean {
  const hostName = new URL(url).hostname
  return (
    hostName.endsWith('imgur.com') ||
    hostName.endsWith('cloudinary.com') ||
    url.includes('notion.so/images/page-cover')
  )
}

async function getNotionHeader(pageId: string) {
  if (!pageId) return { coverUrl: undefined, iconUrl: undefined, postTitle: '' }

  const pageData: any = await retrievePage(pageId)
  const coverUrl = pageData?.cover?.file?.url || pageData?.cover?.external?.url
  const iconUrl = pageData?.icon?.external?.url || pageData?.icon?.file?.url
  const postTitle = getJoinedRichText(pageData?.properties?.Name?.title) || 'Untitled'
  const tags = pageData?.properties?.tags?.multi_select?.map((tag: any) => makeSlugText(tag.name))
  const firstTag = tags?.length ? tags[0] : 'untagged'

  return { coverUrl, iconUrl, postTitle, firstTag }
}

function handleError(errorMessage: string, context: string) {
  console.log(chalk.red(`🚨 [${context}] ${errorMessage}`))
  return
}

function getJoinedRichText(richTextArr?: RichTextItemResponse[]): string {
  if (!richTextArr || !richTextArr.length) return ''
  const textArr = richTextArr.map((richText: RichTextItemResponse) => richText.plain_text)
  return textArr.join('')
}
