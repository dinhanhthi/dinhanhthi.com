import pMemoize from 'p-memoize'

export function parseGithubRepoUrl(url?: string): { owner: string; repo: string } | null {
  if (!url?.trim()) return null

  const trimmed = url.trim()
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(withScheme)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()
  if (host !== 'github.com') return null

  const segments = parsed.pathname.split('/').filter(Boolean)
  if (segments.length < 2) return null

  const owner = segments[0]
  let repo = segments[1]
  if (!owner || !repo) return null

  if (repo.toLowerCase().endsWith('.git')) {
    repo = repo.slice(0, -4)
  }

  if (!repo) return null

  return { owner, repo }
}

async function getLatestGithubReleaseImpl(
  owner: string,
  repo: string
): Promise<{ tagName: string; publishedAt: string } | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'dinhanhthi.com-ssg'
    }

    const token = process.env.GITHUB_TOKEN?.trim()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      cache: 'no-store',
      signal: controller.signal,
      headers
    })

    if (!response.ok) return null

    let data: unknown
    try {
      data = await response.json()
    } catch {
      return null
    }

    if (!data || typeof data !== 'object') return null

    const { tag_name: tagNameRaw, published_at: publishedAt } = data as {
      tag_name?: unknown
      published_at?: unknown
    }

    if (typeof tagNameRaw !== 'string' || typeof publishedAt !== 'string') return null

    const tagName = tagNameRaw.trim()
    if (!tagName || !publishedAt) return null

    const publishedDate = new Date(publishedAt)
    if (Number.isNaN(publishedDate.getTime())) return null

    return { tagName, publishedAt }
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

export const getLatestGithubRelease = pMemoize(getLatestGithubReleaseImpl, {
  cacheKey: ([owner, repo]: [string, string]) => `${owner.toLowerCase()}/${repo.toLowerCase()}`
})
