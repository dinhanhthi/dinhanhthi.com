import cn from 'classnames'

import Container from './Container'

type HeaderProps = {
  children: React.ReactNode
  containerClassName?: string
  childrenContainerClassName?: string
}

export default function Header(props: HeaderProps) {
  return (
    <Container className={props.containerClassName}>
      <div
        className={cn(
          'mx-auto flex flex-col flex-wrap items-center justify-items-stretch px-0 py-8 md:flex-row',
          props.childrenContainerClassName
        )}
      >
        {props.children}
      </div>
    </Container>
  )
}
