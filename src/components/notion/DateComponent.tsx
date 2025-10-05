'use client'

import Moment from 'moment'
import React, { useEffect, useState } from 'react'

import BiDotsHorizontalRounded from '@/src/components/icons/BiDotsHorizontalRounded'

type DateProps = {
  dateString: string
  dateLabel?: string // Eg: 'Updated at:'
  format?: string
  className?: string
  humanize?: boolean
  onlyLabel?: boolean
  humanizeOpts?: {
    today?: string
    yesterday?: string
    daysAgo?: string
    weeksAgo?: string
    monthsAgo?: string
  }
}

export default function DateComponent(props: DateProps) {
  const [hydrated, setHydrated] = useState(false)
  const [humanized, setHumanized] = useState('')
  const fullDate = Moment(props.dateString).format(props.format || 'DD/MM/YYYY')

  useEffect(() => {
    const date = new Date(props.dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      setHumanized(props.humanizeOpts?.today || 'today')
    } else if (diffDays <= 2) {
      setHumanized(props.humanizeOpts?.yesterday || 'yesterday')
    } else if (diffDays <= 7) {
      setHumanized(`${diffDays} ${props.humanizeOpts?.daysAgo || 'days ago'}`)
    } else if (diffDays <= 13) {
      setHumanized(`${Math.floor(diffDays / 7)} ${props.humanizeOpts?.weeksAgo || 'week ago'}`)
    } else if (diffDays <= 30) {
      setHumanized(`${Math.floor(diffDays / 7)} ${props.humanizeOpts?.weeksAgo || 'weeks ago'}`)
    } else if (diffDays <= 59) {
      setHumanized(`${Math.floor(diffDays / 30)} ${props.humanizeOpts?.monthsAgo || 'month ago'}`)
    } else if (diffDays <= 365) {
      setHumanized(`${Math.floor(diffDays / 30)} ${props.humanizeOpts?.monthsAgo || 'months ago'}`)
    } else {
      setHumanized(fullDate)
    }

    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!hydrated) return <BiDotsHorizontalRounded className="opacity-70 animate-ping" />

  return (
    <span className={props.className}>
      {props.dateLabel ? props.dateLabel + ' ' : ''}
      {!props.onlyLabel && <>{props.humanize ? humanized : fullDate}</>}
    </span>
  )
}
