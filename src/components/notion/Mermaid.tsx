'use client'

import cn from 'classnames'
import mermaid from 'mermaid'
import React from 'react'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose'
})

export default class Mermaid extends React.Component<{
  chart: string
  updatedBlock?: React.JSX.Element
  className?: string
}> {
  componentDidMount() {
    mermaid.contentLoaded()
  }
  render() {
    // Class "mermaid" is required by mermaid
    return (
      <div className={cn(this.props.className)}>
        {this.props.updatedBlock}
        <div className={cn('mermaid flex justify-center')}>{this.props.chart}</div>
      </div>
    )
  }
}
