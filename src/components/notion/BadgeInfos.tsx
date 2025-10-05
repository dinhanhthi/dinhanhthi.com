import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

export type BadgeInfosProps = {
  id?: string
  url: string
  title: string
  external?: boolean
  icon?: any
  className?: string
  targetSelf?: boolean
}

export default function BadgeInfos(props: BadgeInfosProps) {
  const aLinkClass = cn(
    'block py-2.5 text-main-dark rounded-3xl border-gray-600 text-sm uppercase',
    'tracking-widest transition duration-300 shadow-md md:shadow-none',
    {
      'bg-transparent px-5 hover:bg-gray-700': !props?.className,
      [`${props?.className}`]: !!props?.className
    }
  )

  if (props.external || props.url.includes('//')) {
    return (
      <a
        className={aLinkClass}
        href={props.url}
        target={props.targetSelf ? '_self' : '_blank'}
        rel="noopener noreferrer"
      >
        {props.icon && <span className="mr-3">{props.icon}</span>}
        <span>{props.title}</span>
      </a>
    )
  }
  return (
    <Link className={aLinkClass} href={props.url}>
      {props.icon && <span className="mr-3">{props.icon}</span>}
      <span>{props.title}</span>
    </Link>
  )
}
