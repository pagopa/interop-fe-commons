import React from 'react'
import { render, waitFor, within } from '@testing-library/react'
import { Pagination } from '../components/Pagination'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

const PaginationHarness: React.FC<{ withRowsPerPage?: boolean }> = ({ withRowsPerPage }) => {
  const [pageNum, setPageNum] = React.useState(1)
  const [limit, setLimit] = React.useState(10)

  return (
    <Pagination
      totalPages={10}
      pageNum={pageNum}
      onPageChange={setPageNum}
      {...(withRowsPerPage
        ? {
            rowPerPageOptions: {
              limit,
              onLimitChange: setLimit,
            },
          }
        : {})}
    />
  )
}

describe('Pagination component', () => {
  describe('Render pagination without rowsPerPage selector and with 100 as total elements', () => {
    it('Should render correctly', () => {
      const screen = render(<PaginationHarness />)
      expect(screen).toBeDefined()
    })

    it('Should not render select with rows per page options', () => {
      const screen = render(<PaginationHarness />)
      const selectElement = screen.queryByTestId('rows-per-page-select')
      expect(selectElement).toBeNull()
    })

    it('If total elements are 100 and default limit is 10, total pages should be 10', () => {
      const screen = render(<PaginationHarness />)
      const paginationElement = screen.getByRole('navigation')

      expect(paginationElement).toBeDefined()
      const lastButton = screen.getByText('10')
      expect(lastButton).toBeDefined()
      const nextButton = screen.queryByText('11')
      expect(nextButton).toBeNull()
    })

    it('If user click on page 5, page 5 should be selected', async () => {
      const screen = render(<PaginationHarness />)
      const pageButton = screen.getByRole('button', {
        name: 'Go to page 5',
      })

      expect(pageButton).not.toBeNull()
      await userEvent.click(pageButton, { delay: 2 })
      await waitFor(() => {
        const buttonAfterClick = screen.getByRole('button', { name: 'page 5' })
        expect(buttonAfterClick).toHaveAttribute('aria-current', 'true')
      })
    })
  })

  describe('Render pagination with rowsPerPage selector enabled and with 100 as total elements', () => {
    it('Should render correctly', () => {
      const screen = render(<PaginationHarness withRowsPerPage />)
      expect(screen).toBeDefined()
    })

    it('Should be available [10,24,36] as rows per page as default options', async () => {
      const screen = render(<PaginationHarness withRowsPerPage />)
      const selectElement = screen.getByTestId('rows-per-page-select')
      const selectButton = within(selectElement).getByRole('combobox')

      expect(selectElement).toBeDefined()
      await userEvent.click(selectButton)

      await waitFor(() => {
        const getOptions = screen.getAllByRole('option')
        expect(getOptions).toHaveLength(3)

        expect(getOptions[0]).toHaveTextContent('10')
        expect(getOptions[1]).toHaveTextContent('24')
        expect(getOptions[2]).toHaveTextContent('36')
      })
    })
  })
})
