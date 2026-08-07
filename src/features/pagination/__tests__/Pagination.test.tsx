import React from 'react'
import { render, waitFor, within } from '@testing-library/react'
import { PaginationExample } from '../stories/PaginationExample'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('Pagination component', () => {
  describe('Render pagination without rowsPerPage selector and with 100 as total elements', () => {
    it('Should render correctly', () => {
      const screen = render(<PaginationExample />)
      expect(screen).toBeDefined()
    })

    it('Should not render select with rows per page options', () => {
      const screen = render(<PaginationExample />)
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

  describe('Render pagination with rowsPerPage selector enabled and with 100 as total elements', () => {
    it('Should render correctly', () => {
      const screen = render(<PaginationExample withRowsPerPage />)
      expect(screen).toBeDefined()
    })

    it('Should be available [10,24,36] as rows per page as default options', async () => {
      const screen = render(<PaginationExample withRowsPerPage />)

      const selectElement = screen.getByTestId('rows-per-page-select')
      const selectButton = within(selectElement).getByRole('button')
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
