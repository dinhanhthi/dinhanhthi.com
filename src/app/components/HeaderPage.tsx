import { ImageType } from '../../lib/types'
import Header from './Header'
import ImageWithLoading from './ImageWithLoading'
import SimpleImage from './SimpleImage'
import { Badge } from './ui/badge'

type HeaderPageProps = {
  title: string
  iconPath?: string // used when an image is on public/ folder and this is the path to that image
  icon?: ImageType // used for custom icon from Notion
  subtitle?: string | React.ReactNode
  number?: number
}

export default function HeaderPage(props: HeaderPageProps) {
  const ImagePlaceholder = () => (
    <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-400"></div>
    </div>
  )
  return (
    <Header className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex w-full shrink-0 flex-row items-center gap-4 lg:w-fit">
        {!!props.iconPath && (
          <ImageWithLoading
            src={props.iconPath}
            alt={props.title}
            height={150}
            width={150}
            priority
          />
        )}
        {!!props.icon && (
          <div className="flex h-[75px] w-[75px] items-center justify-center rounded bg-gray-100 lg:h-[150px] lg:w-[150px]">
            <div className="h-[45px] w-[45px]">
              <SimpleImage
                src={props.icon.sourceUrl || props.icon.staticImageData?.src}
                alt={props.title}
                className="notion-page-cover h-full w-full"
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          </div>
        )}
        <h1 className="font-heading baseline -mb-2 inline-flex items-center gap-2 text-3xl text-slate-700 lg:hidden">
          <span>{props.title}</span>
          {props.number && (
            <Badge variant="outline" className="text-muted inline text-base">
              {props.number}
            </Badge>
          )}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-4">
        <h1 className="font-heading baseline -mb-2 hidden items-center gap-2 text-3xl text-slate-700 lg:inline-flex">
          <span>{props.title}</span>
          {props.number && (
            <Badge variant="outline" className="text-muted inline text-base">
              {props.number}
            </Badge>
          )}
        </h1>
        {props.subtitle && <div className="max-w-full text-slate-700">{props.subtitle}</div>}
      </div>
    </Header>
  )
}

export function HeaderPageSkeleton() {
  return (
    <Header className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex w-full shrink-0 flex-row items-center gap-4 lg:w-fit">
        <div className="h-[150px] w-[150px] animate-pulse rounded-lg bg-slate-300"></div>
        <div className="h-[36px] w-48 animate-pulse rounded bg-slate-300 lg:hidden"></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden h-[36px] w-64 animate-pulse rounded bg-slate-300 lg:block"></div>
        <div className="h-[24px] w-full max-w-2xl animate-pulse rounded bg-slate-300"></div>
      </div>
    </Header>
  )
}
