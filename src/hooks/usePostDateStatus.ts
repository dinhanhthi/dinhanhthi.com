import { useEffect, useState } from 'react'

export const usePostDateStatus = (
  createdDate?: string,
  modifiedDate?: string,
  withinDay?: number
) => {
  const [status, setStatus] = useState<'new' | 'updated' | 'updatedWithin' | 'normal'>('normal')

  useEffect(() => {
    const currentDate = new Date()
    const withinDaysAgo = new Date()
    withinDaysAgo.setDate(currentDate.getDate() - (withinDay || 7))

    if (createdDate) {
      const createdDateObj = new Date(createdDate)

      if (createdDateObj >= withinDaysAgo) {
        setStatus('new')
        return
      }
    }

    if (modifiedDate) {
      const modifiedDateObj = new Date(modifiedDate)

      if (modifiedDateObj >= withinDaysAgo) {
        setStatus('updatedWithin')
        return
      }

      if (createdDate) {
        if (modifiedDateObj > new Date(createdDate)) {
          setStatus('updated')
          return
        }
      }
    }

    setStatus('normal')
  }, [createdDate, modifiedDate, withinDay])

  return status
}
