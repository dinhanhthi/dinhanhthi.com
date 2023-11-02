/* eslint-disable quotes */
import ImageComponent from '@notion-x/src/components/ImageComponent'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Link from 'next/link'
import { Suspense } from 'react'

import me from '../data/me'
import { Tool } from '../interface'
import { SkeletonToolItem, ToolItem } from './(single-page)/tools/ToolsPage'
import Container from './components/Container'
import Footer from './components/Footer'
import HeaderIndex from './components/HeaderIndex'
import ProjectItem, { Project, SkeletonProjectItem } from './components/ProjectItem'
import { bodyPadding, containerWide, defaultBlurDataURL, defaultPostTypeOpts } from './lib/config'
import { getPosts, getProjects, getTools, getTopics } from './lib/fetcher'
import { getMetadata, getUri } from './lib/helpers'

export const revalidate = 20

export const metadata = getMetadata({
  title: "Hi! I'm Thi",
  description: me.quote,
  images: [
    {
      url: 'https://i.imgur.com/PyXUtfTh.png',
      width: 1024,
      height: 581
    }
  ]
})

export const HeadingWithMore = ({
  title,
  href,
  icon
}: {
  title: string
  href?: string
  icon?: React.ReactNode
}) => (
  <h2
    id="notes"
    className={cn(
      'font-heading text-3xl font-medium text-slate-700 flex items-baseline flex-wrap gap-y-0 gap-x-4'
    )}
  >
    {!!icon && icon}
    <span>{title}</span>
    {href && (
      <Link
        className="text-[60%] italic text-slate-600 hover:m2it-link-hover font-normal"
        href={href}
      >
        ...more
      </Link>
    )}
  </h2>
)

export default async function Home() {
  const pinnedPosts = await getPosts({
    pageSize: 4,
    filter: {
      property: 'pinned',
      checkbox: {
        equals: true
      }
    }
  })
  const posts = await getPosts({ pageSize: 10 })
  const projects = await getProjects()
  const _topics = await getTopics()
  const { tools } = await getTools()

  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  const projectsToShow = projects.slice(0, 6)
  const isThereDsProject = projectsToShow.some(project => project.type.includes('ds'))
  const isThereWebProject = projectsToShow.some(project => project.type.includes('web'))
  const isThereOtherProject = projectsToShow.some(project => project.type.includes('other'))

  return (
    <div className="thi-bg-stone">
      <HeaderIndex />
      <Container className={cn(bodyPadding, containerWide)}>
        <div className="flex flex-col gap-14">
          {/* Notes */}
          <div className="flex flex-col gap-2">
            <HeadingWithMore title="Recently updated notes" href="/notes/" />
            {/* pinned */}
            <div className="thi-box-code overflow-hidden mb-3">
              <Suspense
                fallback={
                  <SkeletonPostList
                    count={4}
                    postType="PostSimple"
                    options={{
                      className: 'flex flex-col divide-y'
                    }}
                  />
                }
              >
                <PostList
                  posts={pinnedPosts}
                  postType="PostSimple"
                  postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                  options={{
                    className: 'flex flex-col divide-y'
                  }}
                />
              </Suspense>
            </div>
            {/* notes */}
            <div className="thi-box-code overflow-hidden">
              <Suspense
                fallback={
                  <SkeletonPostList
                    count={8}
                    postType="PostSimple"
                    options={{
                      className: 'flex flex-col divide-y'
                    }}
                  />
                }
              >
                <PostList
                  posts={posts.filter(post => !post.pinned)}
                  postType="PostSimple"
                  postTypeOpts={defaultPostTypeOpts}
                  options={{
                    className: 'flex flex-col divide-y'
                  }}
                />
              </Suspense>
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore title="Recent tools I use" href="/tools/" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
              {tools.slice(0, 6).map((tool: Tool) => (
                <Suspense key={tool.id} fallback={<SkeletonToolItem />}>
                  <ToolItem key={tool.id} tool={tool} compactMode={true} />
                </Suspense>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore title="Main topics" href="/tags/" />
            <div className="flex flex-wrap gap-4">
              {topics
                .filter(t => t.pinned)
                .map(topic => (
                  <Link
                    href={getUri('tag', makeSlugText(topic.name))!}
                    key={makeSlugText(topic.name)}
                    className={cn(
                      'flex items-center gap-1 p-2 thi-box-code',
                      'transition duration-200 ease-in-out hover:-translate-y-0.5',
                      { 'tooltip-auto': topic.description }
                    )}
                    data-title={topic.description}
                  >
                    {topic.icon && (
                      <div>
                        <ImageComponent
                          image={topic.icon}
                          alt={topic.name}
                          imageProps={{ width: 20, height: 20, placeholder: 'empty' }}
                        />
                      </div>
                    )}
                    <div>{topic.name}</div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Projects */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore title="Recent projects" href="/projects/" />
            <div className="flex flex-col gap-x-3 gap-y-4">
              <div className="flex gap-4 flex-wrap">
                {isThereDsProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-sky-600"></div>
                    <div className="text-slate-600 text-sm">
                      <span className="hidden sm:inline whitespace-nowrap">Data Science</span>
                      <span className="sm:hidden">DS</span>
                    </div>
                  </div>
                )}

                {isThereWebProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-amber-500"></div>
                    <div className="text-slate-600 text-sm">
                      <span className="hidden sm:inline whitespace-nowrap">Web Development</span>
                      <span className="sm:hidden">Web</span>
                    </div>
                  </div>
                )}

                {isThereOtherProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-emerald-600"></div>
                    <div className="text-slate-600 text-sm whitespace-nowrap">Others</div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-3 xl:grid-cols-3">
                {projects.slice(0, 6).map((project: Project) => (
                  <Suspense key={project.id} fallback={<SkeletonProjectItem />}>
                    <ProjectItem key={project.id} project={project} grayScale={true} />
                  </Suspense>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}
