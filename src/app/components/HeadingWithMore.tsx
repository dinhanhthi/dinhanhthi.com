import cn from 'classnames'
import Link from 'next/link'

type HeadingWithMoreProps = {
  title: string
  href?: string
  icon?: React.ReactNode
}

export default function HeadingWithMore(props: HeadingWithMoreProps) {
  const { title, href, icon } = props
  return (
    <h2
      id="notes"
      className={cn(
        'font-heading text-[1.7rem] font-medium text-slate-700 flex items-baseline flex-wrap gap-y-0 gap-x-4'
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
}
