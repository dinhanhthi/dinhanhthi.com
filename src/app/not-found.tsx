// https://nextjs.org/docs/app/api-reference/file-conventions/not-found
import cn from 'classnames'
import Link from 'next/link'

import Container from './components/Container'
import { containerNormal } from './lib/config'
import { generateMetaTitle } from './lib/helpers'

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
      <div className={cn('flex flex-col gap-6 items-center justify-center w-full h-full')}>
        <h1 className="text-4xl text-slate-800">Page not found!</h1>
        <p className="text-xl text-slate-800 text-center">
          Please <strong>refresh the page</strong> (Because sometimes the page doesn&apos;t load on
          the first visit.) or <b>use the search</b>.
        </p>
        <p className="text-xl">
          <Link className="m2it-link hover:m2it-link-hover font-semibold" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </Container>
  )
}
