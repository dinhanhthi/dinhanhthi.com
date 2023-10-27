'use client'

import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import cn from 'classnames'
import React, { useRef } from 'react'

import useScript from '../hooks/useScript'

const Comments = ({ className }: { className?: string }) => {
  const comment = useRef(null)

  const status = useScript({
    url: 'https://utteranc.es/client.js',
    theme: 'github-light',
    issueTerm: 'title',
    repo: 'dinhanhthi/dinhanhthi.com-comments',
    ref: comment
  })

  return (
    <div className={cn(className, 'mt-8')}>
      {status === 'loading' && (
        <div className="flex mt-4 items-center justify-center gap-2 animate-pulse text-slate-700">
          <div className="animate-spin">
            <AiOutlineLoading3Quarters className="text-2xl" />
          </div>
          <div>Loading comments...</div>
        </div>
      )}
      <div ref={comment}></div>
    </div>
  )
}

export default Comments
