'use client'

import cn from 'classnames'
import { CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'
import { useState } from 'react'
import CopyToClipboard from "react-copy-to-clipboard";
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {Prism, SyntaxHighlighterProps} from 'react-syntax-highlighter';

import FiCheck from '@/src/app/icons/FiCheck'
import RxCopy from '@/src/app/icons/RxCopy'
import { useNotionContext } from '@/src/lib/notion/context'
import Mermaid from './Mermaid'
import { Text } from './text'
import TooltipX from './tooltip-x'

const SyntaxHighlighter = (Prism as any) as React.FC<SyntaxHighlighterProps>;

type BlockCodeProps = {
  block: CodeBlock
  className?: string
  defaultLanguage?: string
  updatedBlock?: React.JSX.Element
  blurBlockClassName?: string
}

export default function BlockCode(props: BlockCodeProps) {
  const { block, className, defaultLanguage, updatedBlock, blurBlockClassName } = props

  const { recordMap, blockOptions } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const language = (
    block.properties?.language?.[0]?.[0] ||
    defaultLanguage ||
    'typescript'
  ).toLowerCase()
  const caption = block.properties.caption

  const [copied, setCopied] = useState(false)
  const onSuccess = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const copiedLabel = blockOptions?.blockCodeCopiedText || 'Copied'
  const copyLabel = blockOptions?.blockCodeCopyText || 'Copy'

  const copyBtn = (
    <button>
      {!copied && <RxCopy className="text-lg text-slate-400 hover:text-slate-700" />}
      {copied && <FiCheck className="text-lg text-green-600" />}
    </button>
  ) as any

  const copyBtnWrapper = (
    <CopyToClipboard text={content} onCopy={onSuccess}>
      {copyBtn}
    </CopyToClipboard>
  )

  const syntaxWraper = (
    <SyntaxHighlighter
      language={formatCodeLang(language)}
      style={prism}
      className={cn(
        '!my-0 syntax-highlighter-pre m2it-scrollbar m2it-scrollbar-small border !bg-slate-50 max-h-[300px]'
      )}
      showLineNumbers={true}
    >
      {content}
    </SyntaxHighlighter>
  )

  return (
    <div className={cn(className, blurBlockClassName, 'relative flex flex-col gap-2')}>
      {!!updatedBlock && updatedBlock}
      <div
        id={`copy-${block.id}`}
        className={cn(
          '!z-10 _from-right !absolute right-2 top-2 duration-100 hover:cursor-pointer group-hover:opacity-100'
        )}
      >
        {copyBtnWrapper}
      </div>
      <TooltipX id={`#copy-${block.id}`}>{copied ? copiedLabel : copyLabel}</TooltipX>
      <div
        className={`language-${formatCodeLang(
          language
        )} syntax-highlighter text-[14px] relative overflow-hidden`}
      >
        <div className="w-full overflow-hidden">{syntaxWraper}</div>
      </div>

      {caption && (
        <div className="italic opacity-80 text-[0.9em]">
          <Text value={caption} block={block} />
        </div>
      )}

      {language === 'mermaid' && (
        <Mermaid chart={content} updatedBlock={updatedBlock} className={blurBlockClassName} />
      )}
    </div>
  )
}

/**
 * Convert the code language notation of the Notion api to the code language notation of react-syntax-highlighter.
 * https://developers.notion.com/reference/block#code-blocks
 * https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
 */
const formatCodeLang = (lang: string) => {
  switch (lang) {
    case 'plain text':
      return 'plaintext'
    case 'objective-c':
      return 'objectivec'
    default:
      return lang
  }
}
