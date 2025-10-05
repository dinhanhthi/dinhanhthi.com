import SimpleImage from '@/src/app/components/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import { ImageType } from '@/src/lib/types'
import cn from 'classnames'

import { quicksand } from '@/src/lib/fonts'
import Header from './Header'

type HeaderPageProps = {
  headerType?: 'white' | 'gray'
  headerWidth?: 'wide' | 'normal'
  title: string
  subtitle?: string
  childrenContainerClassName?: string
  icon?: ImageType
  iconClassName?: string
  number?: number
}

export default function HeaderPage(props: HeaderPageProps) {
  const ImagePlaceholder = () => (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500">
      <AiOutlineLoading3Quarters className="animate-spin text-[60px] text-white" />
    </div>
  )
  return (
    <Header
      childrenContainerClassName={props.childrenContainerClassName}
      headerType={props.headerType}
      headerWidth={props.headerWidth}
    >
      <div className="w-full py-8">
        <div className="flex flex-col items-center gap-3 md:flex-row">
          {!!props.icon && (
            <div className={cn('h-[45px] w-[45px]', props.iconClassName)}>
              <SimpleImage
                src={props.icon.sourceUrl || props.icon.staticImageData?.src}
                alt={props.title}
                className="notion-page-cover h-full w-full"
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          )}
          <h1 className="flex items-center gap-4 text-center text-2xl leading-tight tracking-tight md:text-left md:text-3xl">
            <span className={cn('thi-text-rainbow font-bold', quicksand.className)}>
              {props.title}
            </span>
            {props.number && (
              <span className="rounded-lg bg-[#565a6b] px-2 py-1 text-[60%] leading-snug font-medium tracking-wide text-white">
                {props.number}
              </span>
            )}
          </h1>
        </div>
        {props.subtitle && (
          <div className="mt-4 text-center text-gray-100 md:mt-0 md:pl-[60px] md:text-left lg:w-4/5">
            {props.subtitle}
          </div>
        )}
      </div>
    </Header>
  )
}

export function HeaderPageSkeleton(props: Partial<HeaderPageProps>) {
  return (
    <Header
      childrenContainerClassName={cn(props.childrenContainerClassName, 'animate-pulse')}
      headerType={props.headerType}
      headerWidth="wide"
    >
      <div className="flex w-full flex-col items-center gap-3 py-8 md:flex-row">
        <div className={cn(props.iconClassName, 'rounded-full bg-slate-400')}>
          <div className="h-[45px] w-[45px]"></div>
        </div>
        <div className="h-[35px] w-1/2 rounded-3xl bg-slate-400"></div>
      </div>
    </Header>
  )
}
