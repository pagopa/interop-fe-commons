import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { PaginationExample } from '../stories/PaginationExample'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe.only('Pagination component', () => {
  // const renderPagination = () => {
  //   return render(<Pagination pageNum={1} totalPages={2} onPageChange={vi.fn()} />)
  // }

  describe('Render pagination without rowsPerPage selector and with 100 as total elements', () => {
    it('Should render correctly', () => {
      const screen = render(<PaginationExample />)
      expect(screen).toBeDefined()
    })

    it('Should not render select with rows per page options', () => {
      const screen = render(<PaginationExample />)
      screen.debug()
      const selectElement = screen.queryByTestId('rows-per-page-select')
      expect(selectElement).toBeNull()
    })

    it('If total elements are 100 and default limit is 10, total pages should be 10', () => {
      const screen = render(<PaginationExample />)
      const paginationElement = screen.getByRole('navigation')

      expect(paginationElement).toBeDefined()
      const lastButton = screen.getByText('10')
      expect(lastButton).toBeDefined()
      const nextButton = screen.queryByText('11')
      expect(nextButton).toBeNull()
    })

    it('If user click on page 5, page 5 should be selected', async () => {
      const screen = render(<PaginationExample />)
      const pageButton = screen.getByRole('button', {
        name: 'Go to page 5',
      })

      expect(pageButton).not.toBeNull()
      await userEvent.click(pageButton, { delay: 2 })
      await waitFor(() => {
        const buttonAfterClick = screen.getByText('5')
        expect(buttonAfterClick).toHaveClass('Mui-selected')
      })
    })
  })
})
