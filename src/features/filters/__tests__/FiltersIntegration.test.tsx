import React from 'react'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import { Filters } from '../components/Filters'
import { useFilters } from '../hooks/useFilters'
import type { FilterFields, FiltersParams } from '../filters.types'

const fieldMocks: FilterFields = [
  { name: 'q', type: 'freetext', label: 'Name' },
  {
    name: 'status',
    type: 'autocomplete-multiple',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },
    ],
    label: 'Status',
  },
]

/**
 * Integration wrapper that wires useFilters + Filters together,
 * matching the real usage pattern in the frontend.
 * Includes a hidden element exposing current URL search params for assertions.
 */
const FiltersWrapper: React.FC<{ hasSubmitButton?: boolean }> = ({ hasSubmitButton }) => {
  const { filtersParams: _filtersParams, ...filtersHandlers } =
    useFilters<FiltersParams>(fieldMocks)
  const [searchParams] = useSearchParams()
  return (
    <>
      <Filters {...filtersHandlers} hasSubmitButton={hasSubmitButton} />
      <div data-testid="search-params">{searchParams.toString()}</div>
    </>
  )
}

function renderFiltersWrapper(hasSubmitButton = true, initialSearch?: string) {
  const initialEntries = initialSearch ? [`/?${initialSearch}`] : ['/']
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={<FiltersWrapper hasSubmitButton={hasSubmitButton} />} />
      </Routes>
    </MemoryRouter>
  )
}

function getSearchParams(): string {
  return screen.getByTestId('search-params').textContent ?? ''
}

describe('Filters integration with hasSubmitButton', () => {
  it('should have "Filtra" and "Annulla filtri" buttons disabled when no filter value is entered', () => {
    renderFiltersWrapper()

    expect(screen.getByRole('button', { name: 'Filtra' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Annulla filtri' })).toBeDisabled()
  })

  it('should enable buttons when a filter value is entered', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper()

    await user.type(screen.getByLabelText('Name'), 'test')

    expect(screen.getByRole('button', { name: 'Filtra' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Annulla filtri' })).toBeEnabled()
  })

  it('should update URL params and show chip after clicking "Filtra"', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper()

    await user.type(screen.getByLabelText('Name'), 'test-value')
    await user.click(screen.getByRole('button', { name: 'Filtra' }))

    await waitFor(() => {
      expect(getSearchParams()).toContain('q=test-value')
    })

    expect(screen.getByText('test-value')).toBeInTheDocument()
  })

  it('should remove chip and URL param when a chip is deleted', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper(true, 'q=existing-filter')

    expect(screen.getByText('existing-filter')).toBeInTheDocument()
    expect(getSearchParams()).toContain('q=existing-filter')

    await user.click(screen.getByTestId('CancelIcon'))

    await waitFor(() => {
      expect(getSearchParams()).not.toContain('q=')
    })

    expect(screen.queryByText('existing-filter')).not.toBeInTheDocument()
  })

  it('should clear URL params when clicking "Annulla filtri" after submitting a filter', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper()

    // Type and submit
    await user.type(screen.getByLabelText('Name'), 'some-filter')
    await user.click(screen.getByRole('button', { name: 'Filtra' }))

    await waitFor(() => {
      expect(getSearchParams()).toContain('q=some-filter')
    })
    expect(screen.getByText('some-filter')).toBeInTheDocument()

    // Type something new to re-enable the buttons, then cancel
    await user.type(screen.getByLabelText('Name'), 'x')
    await user.click(screen.getByRole('button', { name: 'Annulla filtri' }))

    await waitFor(() => {
      expect(getSearchParams()).not.toContain('q=')
    })

    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('')
  })

  it('should delete offset from URL when submitting filters', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper(true, 'offset=20')

    expect(getSearchParams()).toContain('offset=20')

    await user.type(screen.getByLabelText('Name'), 'test')
    await user.click(screen.getByRole('button', { name: 'Filtra' }))

    await waitFor(() => {
      expect(getSearchParams()).not.toContain('offset=')
    })
    expect(getSearchParams()).toContain('q=test')
  })

  it('should delete offset from URL when removing a filter chip', async () => {
    const user = userEvent.setup()
    renderFiltersWrapper(true, 'q=test&offset=20')

    expect(getSearchParams()).toContain('offset=20')

    await user.click(screen.getByTestId('CancelIcon'))

    await waitFor(() => {
      expect(getSearchParams()).not.toContain('offset=')
    })
    expect(getSearchParams()).not.toContain('q=')
  })
})
