import React from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * @description
 * This hook is used to manage the pagination state keeping it in sync with the url params.
 * @param options - An object with a `limit` property used to calculate the current page number.
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
export function usePagination(options: { limit: number }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = parseInt(searchParams.get('offset') ?? '0', 10)
  const limit = options.limit

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

  const paginationProps = {
    pageNum,
    onPageChange: handlePageChange,
  }

  const paginationParams = { limit, offset }

  return {
    paginationParams,
    paginationProps,
    getTotalPageCount,
  }
}
