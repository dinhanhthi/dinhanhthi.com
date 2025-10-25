// https://nextjs.org/docs/app/api-reference/file-conventions/not-found
import cn from 'classnames'
import Link from 'next/link'

import { generateMetaTitle } from '@/src/lib/helpers'
import Container from './components/Container'

export const metadata = {
  title: generateMetaTitle('Page not found!'),
  openGraph: {
    images: [
      {
        url: 'https://i.imgur.com/DvWuLpyh.png',
        width: 1024,
        height: 581
      }
    ]
  }
}

export default function NotFoundPage() {
  return (
    <Container className={cn('h-screen')}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="font-heading text-text-heading text-3xl">
          Page not found <span className="text-link-hover">but it may be my fault</span>!
        </h1>
        <div className="text-text flex flex-col gap-2 text-lg">
          <div className="flex items-baseline gap-2">
            <div className="bg-link-hover flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-2 text-white">
              1
            </div>
            <div>
              Please <strong>refresh the page</strong> because sometimes the page doesn&apos;t load
              on the first visit.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-link-hover flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-2 text-white">
              2
            </div>
            <div>
              Please change from <code className="text-link-hover">/something/</code> to{' '}
              <code className="text-link-hover">/note/something/</code> because I{"'"}ve changed the
              route of all notes to <code className="font-bold">/note/</code>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-link-hover flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-2 text-white">
              3
            </div>
            <div>
              Please <strong>use search</strong>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-link-hover flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-2 text-white">
              4
            </div>
            <div>
              Please <strong>wait for a few minutes</strong> because there are sometimes technical
              issues on rendering pages.
            </div>
          </div>
        </div>
        <p className="text-xl">
          <Link className="text-link hover:text-link-hover font-semibold" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </Container>
  )
}
