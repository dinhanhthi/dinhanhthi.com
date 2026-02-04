// Temporary debug route - DELETE after debugging
export async function GET() {
  const notionEnvKeys = Object.keys(process.env).filter(key => key.includes('NOTION'))
  const allEnvKeysCount = Object.keys(process.env).length

  return new Response(
    JSON.stringify({
      notionEnvKeys,
      allEnvKeysCount,
      hasNotionApiPublished: !!process.env.NOTION_API_PUBLISHED,
      hasNotionDbPosts: !!process.env.NOTION_DB_POSTS,
      // Show partial value for debugging (first 20 chars only)
      notionApiPublishedPreview: process.env.NOTION_API_PUBLISHED
        ? `${process.env.NOTION_API_PUBLISHED.slice(0, 20)}...`
        : null
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
