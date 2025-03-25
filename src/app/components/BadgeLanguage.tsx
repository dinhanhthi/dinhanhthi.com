import TooltipX from '@notion-x/src/components/tooltip-x'
import Image from 'next/image'
import Link from 'next/link'

export default function BadgeLanguage(props: {
  id?: string
  icon: any
  url: string
  title: string
  imgClass?: string
}) {
  return (
    <>
      <Link
        className="group flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-700 p-2 shadow-none md:p-1.5"
        href={props.url}
        id={props.id}
      >
        <Image
          src={props.icon}
          alt={props.title}
          width={24}
          height={24}
          className="rounded-full transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      </Link>
      <TooltipX id={`#${props.id}`}>{props.title}</TooltipX>
    </>
  )
}
