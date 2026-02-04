import { useMemo } from 'react'

export type PostDateStatus = 'new' | 'updated' | 'updatedWithin' | 'normal'

export const usePostDateStatus = (
  createdDate?: string,
  modifiedDate?: string,
  withinDay?: number
): PostDateStatus => {
  return useMemo(() => {
    return getPostDateStatus(createdDate, modifiedDate, withinDay)
  }, [createdDate, modifiedDate, withinDay])
}

/**
 * Pure function to calculate post date status
 * Can be used both on server and client
 */
export const getPostDateStatus = (
  createdDate?: string,
  modifiedDate?: string,
  withinDay?: number
): PostDateStatus => {
  const currentDate = new Date()
  const withinDaysAgo = new Date()
  withinDaysAgo.setDate(currentDate.getDate() - (withinDay || 7))

  if (createdDate) {
    const createdDateObj = new Date(createdDate)

    if (createdDateObj >= withinDaysAgo) {
      return 'new'
    }
  }

  if (modifiedDate) {
    const modifiedDateObj = new Date(modifiedDate)

    if (modifiedDateObj >= withinDaysAgo) {
      return 'updatedWithin'
    }

    if (createdDate) {
      if (modifiedDateObj > new Date(createdDate)) {
        return 'updated'
      }
    }
  }

  return 'normal'
}
