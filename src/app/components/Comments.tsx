'use client'

import cn from 'classnames'

import Giscus from '@giscus/react'
import { containerNormal } from '../lib/config'
import Container from './Container'

const Comments = ({ className }: { className?: string }) => {
  return (
    <Container className={cn(className, containerNormal, 'mt-8')}>
      <Giscus
        id="post-comments"
        repo="dinhanhthi/dinhanhthi.com-comments"
        repoId="R_kgDOKKrH3g"
        category="Comments"
        categoryId="DIC_kwDOKKrH3s4Cf_fv"
        mapping="title"
        term="Welcome!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </Container>
  )
}

export default Comments
