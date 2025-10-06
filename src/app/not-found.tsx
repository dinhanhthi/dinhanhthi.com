// https://nextjs.org/docs/app/api-reference/file-conventions/not-found
import cn from 'classnames'
import Link from 'next/link'

import { containerNormal } from '@/src/lib/config'
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
    <Container className={cn('h-screen', containerNormal)}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="text-3xl text-slate-800">
          Page not found <span className="text-pink-700">but it may be my fault</span>!
        </h1>
        <div className="flex flex-col gap-2 text-lg text-slate-800">
          <div className="flex items-baseline gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-700 p-2 text-white">
              1
            </div>
            <div>
              Please <strong>refresh the page</strong> because sometimes the page doesn&apos;t load
              on the first visit.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-700 p-2 text-white">
              2
            </div>
            <div>
              Please change from <code className="text-pink-700">/something/</code> to{' '}
              <code className="text-pink-700">/note/something/</code> because I{"'"}ve changed the
              route of all notes to <code className="font-bold">/note/</code>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-700 p-2 text-white">
              3
            </div>
            <div>
              Please <strong>use search</strong>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-700 p-2 text-white">
              4
            </div>
            <div>
              Please <strong>wait for a few minutes</strong> because there are sometimes technical
              issues on rendering pages.
            </div>
          </div>
        </div>
        <p className="text-xl">
          <Link className="m2it-link hover:m2it-link-hover font-semibold" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </Container>
  )
}
