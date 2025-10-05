import cn from 'classnames'

import { containerNormal, containerWide } from '@/src/lib/config'
import Container from './Container'

type HeaderProps = {
  children: React.ReactNode
  childrenContainerClassName?: string
  headerType?: 'white' | 'gray'
  headerWidth?: 'wide' | 'normal'
}

export default function Header(props: HeaderProps) {
  return (
    <>
      <div className="from-main-dark-bg to-nav-dark-bg bg-gradient-to-b">
        <Container className={props.headerWidth === 'wide' ? containerWide : containerNormal}>
          <div
            className={cn(
              'mx-auto flex flex-col flex-wrap items-center justify-items-stretch px-0 py-8 md:flex-row',
              props.childrenContainerClassName
            )}
          >
            {props.children}
          </div>
        </Container>
      </div>

      <div
        className={cn({
          'bg-wave-top-white': !props.headerType || props.headerType === 'white',
          'bg-wave-top-stone': props.headerType === 'gray'
        })}
      ></div>
    </>
  )
}
