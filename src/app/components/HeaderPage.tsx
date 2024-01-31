import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { ImageType } from '@notion-x/src/interface'
import cn from 'classnames'

import Header from './Header'

type HeaderPageProps = {
  headerType?: 'white' | 'gray'
  headerWidth?: 'wide' | 'normal'
  title: string
  subtitle?: string
  childrenContainerClassName?: string
  icon?: ImageType
  iconClassName?: string
}

export default function HeaderPage(props: HeaderPageProps) {
  const ImagePlaceholder = () => (
    <div
      className={cn(
        'bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center w-full h-full',
        'flex flex-col rounded-full'
      )}
    >
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
                className="notion-page-cover"
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          )}
          <h1
            className={cn(
              `text-2xl md:text-3xl xl:text-4xl font-semibold leading-tight
            tracking-tight text-center md:text-left thi-text-rainbow`
            )}
          >
            {props.title}
          </h1>
        </div>
        {props.subtitle && (
          <div
            className={cn(
              'text-gray-100 mt-4 md:mt-0 md:pl-[60px] text-center md:text-left lg:w-4/5'
            )}
          >
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
      <div className="flex flex-col md:flex-row items-center gap-3 py-8">
        <div>
          <div className={cn(props.iconClassName, 'rounded-full bg-slate-400')}>
            <div className="h-[45px] w-[45px]"></div>
          </div>
        </div>
        <div className="h-[35px] bg-slate-400 w-[250px] rounded-lg"></div>
      </div>
    </Header>
  )
}
