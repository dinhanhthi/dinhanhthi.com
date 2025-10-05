import SimpleImage from '@/src/components/notion/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/components/icons/AiOutlineLoading3Quarters'
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
    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center w-full h-full flex-col rounded-full">
      <AiOutlineLoading3Quarters className="text-[60px] text-white animate-spin" />
    </div>
  )
  return (
    <Header
      childrenContainerClassName={props.childrenContainerClassName}
      headerType={props.headerType}
      headerWidth={props.headerWidth}
    >
      <div className="py-8 w-full">
        <div className="flex flex-col md:flex-row items-center gap-3">
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
          <h1 className="flex items-center gap-4 text-2xl md:text-3xl leading-tight tracking-tight text-center md:text-left">
            <span className={cn('thi-text-rainbow font-bold', quicksand.className)}>
              {props.title}
            </span>
            {props.number && (
              <span className="bg-[#565a6b] text-white font-medium text-[60%] rounded-lg px-2 py-1 leading-snug tracking-wide">
                {props.number}
              </span>
            )}
          </h1>
        </div>
        {props.subtitle && (
          <div className="text-gray-100 mt-4 md:mt-0 md:pl-[60px] text-center md:text-left lg:w-4/5">
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
      <div className="flex flex-col md:flex-row items-center gap-3 py-8 w-full">
        <div className={cn(props.iconClassName, 'rounded-full bg-slate-400')}>
          <div className="h-[45px] w-[45px]"></div>
        </div>
        <div className="h-[35px] bg-slate-400 w-1/2 rounded-3xl"></div>
      </div>
    </Header>
  )
}
