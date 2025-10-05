// https://nextjs.org/docs/app/api-reference/file-conventions/not-found
import cn from 'classnames'
import Link from 'next/link'

import Container from './components/Container'
import { containerNormal } from '@/src/lib/config'
import { generateMetaTitle } from '@/src/lib/helpers'

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
      <div className="flex flex-col gap-6 items-center justify-center w-full h-full">
        <h1 className="text-3xl text-slate-800">
          Page not found <span className="text-pink-700">but it may be my fault</span>!
        </h1>
        <div className="text-lg text-slate-800 flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <div className="bg-pink-700 text-white p-2 rounded-full w-6 h-6 flex shrink-0 items-center justify-center">
              1
            </div>
            <div>
              Please <strong>refresh the page</strong> because sometimes the page doesn&apos;t load
              on the first visit.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-pink-700 text-white p-2 rounded-full w-6 h-6 flex shrink-0 items-center justify-center">
              2
            </div>
            <div>
              Please change from <code className="text-pink-700">/something/</code> to{' '}
              <code className="text-pink-700">/note/something/</code> because I{"'"}ve changed the
              route of all notes to <code className="font-bold">/note/</code>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-pink-700 text-white p-2 rounded-full w-6 h-6 flex shrink-0 items-center justify-center">
              3
            </div>
            <div>
              Please <strong>use search</strong>.
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="bg-pink-700 text-white p-2 rounded-full w-6 h-6 flex shrink-0 items-center justify-center">
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
