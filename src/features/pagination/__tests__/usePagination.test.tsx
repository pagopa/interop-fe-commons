import React from 'react'
import { act, renderHook } from '@testing-library/react'
import { throws } from 'assert'
import { createMemoryHistory, type History } from 'history'
import { usePagination } from '../hooks/usePagination'
import { TestingRouterWrapper } from '@/utils/testing.utils'

function createMemoryHistoryWithTestSearchParams(searchParams: Record<string, string> = {}) {
  const memoryHistory = createMemoryHistory()

  const additionalSearchParams = new URLSearchParams(searchParams).toString()

  memoryHistory.push(
    `/?${additionalSearchParams}&testFilterString=test&testFilterArray=testArray1&testFilterArray=testArray2`
  )
  return memoryHistory
}

function renderUsePaginationHook(options: Parameters<typeof usePagination>[0], history?: History) {
  return renderHook(() => usePagination(options), {
    wrapper: ({ children }) => (
      <TestingRouterWrapper history={history}>{children}</TestingRouterWrapper>
    ),
  })
}

describe('usePagination testing', () => {
  it('Should take initial state from url search params', () => {
    const history = createMemoryHistoryWithTestSearchParams()
    const { result } = renderUsePaginationHook({ limit: 10 }, history)

    expect(result.current.paginationParams).toEqual({
      limit: 10,
      offset: 0,
    })
  })

  it('Should keep the offset param and pageNum prop in sync with the offset url param', () => {
    const history = createMemoryHistory()
    const { result, rerender } = renderUsePaginationHook({ limit: 25 }, history)

    history.push('/?offset=50')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(50)
    expect(result.current.paginationProps.pageNum).toEqual(3)

    history.push('/?offset=100')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(100)
    expect(result.current.paginationProps.pageNum).toEqual(5)

    history.push('/?offset=150')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(150)
    expect(result.current.paginationProps.pageNum).toEqual(7)
  })

  it('Should update the offset url param on page change', () => {
    const history = createMemoryHistory()
    const { result } = renderUsePaginationHook({ limit: 25 }, history)

    expect(history.location.search).toEqual('')

    act(() => {
      result.current.paginationProps.onPageChange(2)
    })

    expect(history.location.search).toEqual('?offset=25')

    act(() => {
      result.current.paginationProps.onPageChange(3)
    })

    expect(history.location.search).toEqual('?offset=50')
  })

  it('Should keep the other url params when changing the offset param', () => {
    const history = createMemoryHistory()
    history.push('/?test=0')

    const { result } = renderUsePaginationHook({ limit: 25 }, history)

    expect(history.location.search).toEqual('?test=0')

    act(() => {
      result.current.paginationProps.onPageChange(2)
    })

    expect(history.location.search).toContain('test=0')

    act(() => {
      result.current.paginationProps.onPageChange(3)
    })

    expect(history.location.search).toContain('test=0')
  })

  it('Should handle page changes correctly', () => {
    const { result, rerender } = renderUsePaginationHook({ limit: 20 })

    // Record<PageNum, ExpectedResult>
    const TEST_CASES = {
      2: 20,
      1: 0,
      3: 40,
      4: 60,
      99: 1960,
      1000: 19980,
      9999: 199960,
    }

    Object.entries(TEST_CASES).forEach(([pageNum, expectedResult]) => {
      act(() => {
        result.current.paginationProps.onPageChange(Number(pageNum))
      })
      rerender()
      expect(result.current.paginationParams.offset).toEqual(expectedResult)
    })

    throws(() => {
      result.current.paginationProps.onPageChange(0)
    })
  })

  it("should not sync the url params if 'syncUrlParams' is false", () => {
    const history = createMemoryHistory()
    const { result } = renderUsePaginationHook({ limit: 25, syncUrlParams: false }, history)

    expect(history.location.search).toEqual('')

    act(() => {
      result.current.paginationProps.onPageChange(2)
    })

    expect(history.location.search).toEqual('')
    expect(result.current.paginationParams.offset).toEqual(25)
  })

  it('Should get the correct total page count', () => {
    const { result } = renderUsePaginationHook({ limit: 25 })

    expect(result.current.getTotalPageCount(99)).toEqual(4)
    expect(result.current.getTotalPageCount(430)).toEqual(18)
    expect(result.current.getTotalPageCount(10)).toEqual(1)
    expect(result.current.getTotalPageCount(26)).toEqual(2)
    expect(result.current.getTotalPageCount(24)).toEqual(1)
  })
})
