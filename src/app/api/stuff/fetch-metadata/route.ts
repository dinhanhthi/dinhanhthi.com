import { JSDOM } from 'jsdom'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 500 })
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata
    const getMetaContent = (property: string, attribute = 'property') => {
      const element = document.querySelector(`meta[${attribute}="${property}"]`)
      return element?.getAttribute('content') || ''
    }

    const title =
      getMetaContent('og:title') ||
      getMetaContent('twitter:title') ||
      document.querySelector('title')?.textContent ||
      ''

    const description =
      getMetaContent('og:description') ||
      getMetaContent('twitter:description') ||
      getMetaContent('description', 'name') ||
      ''

    const image =
      getMetaContent('og:image') ||
      getMetaContent('twitter:image') ||
      getMetaContent('image', 'name') ||
      ''

    // Make image URL absolute if it's relative
    let imageUrl = image
    if (image && !image.startsWith('http')) {
      try {
        const baseUrl = new URL(url)
        imageUrl = new URL(image, baseUrl.origin).href
      } catch {
        imageUrl = image
      }
    }

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl.trim(),
      url: url.trim()
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}
