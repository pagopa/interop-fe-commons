import React from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * @description
 * This hook is used to manage the pagination state keeping it in sync with the url params.
 * @param options - The options for pagination.
 * @param options.limit - The number of items per page.
 * @param options.syncUrlParams- If true, the hook will sync the pagination state with the URL params. @default true
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
export function usePagination({
  limit,
  syncUrlParams = true,
}: {
  limit: number
  syncUrlParams?: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [offsetInternalState, setOffsetInternalState] = React.useState(0)

  const offset = syncUrlParams
    ? parseInt(searchParams.get('offset') ?? '0', 10)
    : offsetInternalState

  const pageNum = Math.ceil(offset / limit) + 1

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }
      const newOffset = Math.max(0, (newPage - 1) * limit)

      if (syncUrlParams) {
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
        window.scroll(0, 0)
      } else {
        setOffsetInternalState(newOffset)
      }
    },
    [limit, syncUrlParams, setSearchParams]
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
