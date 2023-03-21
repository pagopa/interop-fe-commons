import React from 'react'
import { Pagination } from '../components/Pagination'
import { vi } from 'vitest'
import renderer from 'react-test-renderer'

describe('Pagination component', () => {
  it('Renders correctly', () => {
    const tree = renderer
      .create(<Pagination pageNum={1} totalPages={2} onPageChange={vi.fn()} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Does not render when total pages are equal 1', () => {
    const tree = renderer
      .create(<Pagination pageNum={1} totalPages={1} onPageChange={vi.fn()} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
