import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

const paramsSchema = z.coerce.number().int().positive()
const limitSchema = paramsSchema.catch(10)
const offsetSchema = paramsSchema.catch(0)

/**
 * @description
 * This hook is used to manage the pagination state keeping it in sync with the url params.
 * @param options - An object with a `limit` property used to calculate the current page number. If options has not passed by default limit will be "10".
 * @returns The pagination params, pagination props to be passed to the `Pagination` component and a function to get the total page count.
 * @example
 * const {
 *   paginationParams,
 *   paginationProps,
 *   getTotalPageCount
 * } = usePagination({ limit: 10 })
 *
 * const totalPages = getTotalPageCount(response.totalCount)
 *
 * return (
 *   <Pagination {...paginationProps} totalPages={totalPages} />
 * )
 *
 */
export function usePagination(options?: { limit: number }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = offsetSchema.parse(searchParams.get('offset'))
  const limit = limitSchema.parse(options?.limit || searchParams.get('limit'))

  const pageNum = Math.ceil(offset / limit) + 1

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }
      window.scroll(0, 0)
      const newOffset = (newPage - 1) * limit

      // Syncs the new offset to the "offset" search param
      if (newOffset > 0) {
        setSearchParams((searchParams) => {
          searchParams.set('offset', newOffset.toString())
          return searchParams
        })
        return
      }

      // Removes the search param "offset" if the offset is 0 (page == 1)
      setSearchParams((searchParams) => {
        searchParams.delete('offset')
        return searchParams
      })
    },
    [limit, setSearchParams]
  )

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limit)
    },
    [limit]
  )

  const handleLimitChange = React.useCallback(
    (newLimit: number) => {
      if (newLimit < 1) {
        throw new Error(`Number of items per page ${newLimit} is not valid`)
      }

      window.scroll(0, 0)
      setSearchParams((searchParams) => {
        searchParams.set('limit', newLimit.toString())
        searchParams.delete('offset')
        return searchParams
      })
    },
    [setSearchParams]
  )

  const paginationProps = {
    pageNum,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
  }

  const paginationParams = { limit, offset }

  return {
    paginationParams,
    paginationProps,
    getTotalPageCount,
  }
}
