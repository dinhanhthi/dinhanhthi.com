import cn from 'classnames'

import { containerNormal, containerWide } from '../lib/config'
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
      <div className={cn('bg-gradient-to-b from-main-dark-bg to-nav-dark-bg')}>
        <Container className={props.headerWidth === 'wide' ? containerWide : containerNormal}>
          <div
            className={cn(
              'mx-auto py-8 px-0',
              'flex flex-col flex-wrap items-center justify-items-stretch md:flex-row',
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
