import ProjectIcon from '@/public/project.svg'
import cn from 'classnames'
import { Suspense } from 'react'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { ProjectType, SkeletonProjectItem } from '../../components/ProjectItem'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialProjects } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import ProjectPage from './ProjectPage'

export const revalidate = 20

const title = 'Projects'
const description = 'A list of projects I have done so far.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ProjectsPage() {
  const projects = await getUnofficialProjects()

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        headerType="gray"
        title="Projects"
        subtitle={`I love building things. Practicing is the best way to learn. Here are some of
          my projects.`}
        headerWidth="wide"
        icon={{ staticImageData: ProjectIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonProjectContainer />}>
          <ProjectPage projects={projects} />
        </Suspense>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}

function SkeletonProjectContainer() {
  const buttonClassName = (type: ProjectType) =>
    cn(
      'px-4 py-1.5 thi-box-code rounded-3xl border-l-4 flex gap-2',
      'text-[0.95rem] flex items-center justify-center text-white',
      {
        'border-l-sky-600': type === 'ds',
        'border-l-amber-500': type === 'web',
        'border-l-emerald-600': type === 'other',
        'bg-sky-600': type === 'ds',
        'bg-amber-500': type === 'web',
        'bg-emerald-600': type === 'other'
      }
    )

  const numClass = () =>
    cn(
      'bg-[#ffffffb8] text-slate-800 rounded-full text-[0.8rem] flex items-center justify-center',
      'h-5 w-6'
    )
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center sm:justify-start">
        <div className="text-slate-600 whitespace-nowrap">Show only?</div>
        <div className="flex gap-4">
          <button className={buttonClassName('ds')}>
            <span className="hidden md:inline whitespace-nowrap">Data Science</span>
            <span className="md:hidden">DS</span>
            <span className={numClass()}>?</span>
          </button>
          <button className={buttonClassName('web')}>
            <span className="hidden md:inline whitespace-nowrap">Web Development</span>
            <span className="md:hidden">Web</span>
            <span className={numClass()}>?</span>
          </button>
          <button className={buttonClassName('other')}>
            Others
            <span className={numClass()}>?</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonProjectItem key={i} />
        ))}
      </div>
    </div>
  )
}
