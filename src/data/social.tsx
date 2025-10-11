export type SocialItem = {
  id: string
  title: string
  url: string
  lucideIcon?: string
}

const socials: SocialItem[] = [
  {
    id: 'github',
    title: 'Github',
    lucideIcon: 'GithubIcon',
    url: 'https://github.com/dinhanhthi'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    lucideIcon: 'LinkedinIcon',
    url: 'https://www.linkedin.com/in/dinhanhthi/'
  },
  {
    id: 'twitter',
    title: 'X',
    lucideIcon: 'TwitterIcon',
    url: 'https://x.com/dinhanhthi'
  },
  {
    id: 'goodreads',
    title: 'Goodreads',
    lucideIcon: 'Goodreads',
    url: 'https://www.goodreads.com/user/show/19630622-thi-dinh'
  }
]

export default socials
