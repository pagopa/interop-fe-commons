import React from 'react'
import type { ActiveFilters, FilterFields } from '@/features/filters/filters.types'
import renderer from 'react-test-renderer'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { renderWithRouter, TestingRouterWrapper } from '@/utils/testing.utils'
import { Filters } from '../components/Filters'

const onTextInputChangeFn = vi.fn()

const fieldMocks: FilterFields = [
  { name: 'single-field', type: 'freetext', label: 'Single Filter Field' },
  { name: 'numeric-field', type: 'numeric', label: 'Numeric Field' },
  {
    name: 'multiple-field',
    type: 'autocomplete-multiple',
    options: [
      { label: 'Option1', value: 'option-1' },
      { label: 'Option2', value: 'option-2' },
    ],
    label: 'Multiple Filter Field',
    onTextInputChange: onTextInputChangeFn,
  },
  {
    name: 'autocomplete-single-field',
    type: 'autocomplete-single',
    options: [
      { label: 'Option1', value: 'option-1' },
      { label: 'Option2', value: 'option-2' },
    ],
    label: 'Autocomplete Single Field',
    onTextInputChange: onTextInputChangeFn,
  },
]

const activeFiltersMocks: ActiveFilters = [
  {
    label: 'Option1',
    value: 'option-1',
    type: 'autocomplete-multiple',
    filterKey: 'multiple-field',
  },
  {
    label: 'Option2',
    value: 'option-2',
    type: 'autocomplete-multiple',
    filterKey: 'multiple-field',
  },
  { label: 'Test', value: 'test-value', type: 'freetext', filterKey: 'single-field' },
]

describe('Filters component', () => {
  it('matches the snapshot without active filters', () => {
    const tree = renderer
      .create(
        <TestingRouterWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={[]}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </TestingRouterWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with one active filter', () => {
    const tree = renderer
      .create(
        <TestingRouterWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={[activeFiltersMocks[0]]}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </TestingRouterWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with more than one active filters', () => {
    const tree = renderer
      .create(
        <TestingRouterWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={activeFiltersMocks}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </TestingRouterWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with one active filter and a right content', () => {
    const tree = renderer
      .create(
        <TestingRouterWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={[activeFiltersMocks[0]]}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
            rightContent={<div>Right Content</div>}
          />
        </TestingRouterWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with more than one active filters and right content', () => {
    const tree = renderer
      .create(
        <TestingRouterWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={activeFiltersMocks}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
            rightContent={<div>Right Content</div>}
          />
        </TestingRouterWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should correctly add a filter using single filter field', async () => {
    const user = userEvent.setup()
    const onChangeActiveFilterFn = vi.fn()
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'test-value')
    expect(singleFilterField.value).toBe('test-value')
    await user.type(singleFilterField, '{enter}')
    expect(onChangeActiveFilterFn).toBeCalledWith('freetext', 'single-field', 'test-value')
    expect(singleFilterField.value).toBe('')
  })

  it('should correctly add a filter using multiple filter field', async () => {
    const user = userEvent.setup()

    const onChangeActiveFilterFn = vi.fn()
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />
    )

    const multipleFilterField = screen.getByLabelText('Multiple Filter Field') as HTMLSelectElement
    await user.click(multipleFilterField)
    vi.useFakeTimers()
    const option1 = screen.getByRole('option', { name: 'Option1' })
    fireEvent.click(option1)
    const option2 = screen.getByRole('option', { name: 'Option2' })
    fireEvent.click(option2)
    vi.advanceTimersByTime(400)
    expect(onChangeActiveFilterFn).toBeCalledWith('autocomplete-multiple', 'multiple-field', [
      {
        label: 'Option1',
        value: 'option-1',
      },
      {
        label: 'Option2',
        value: 'option-2',
      },
    ])
    vi.useRealTimers()
  })

  it('should correctly remove a filter', async () => {
    const onRemoveActiveFilterFn = vi.fn()
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={activeFiltersMocks}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={onRemoveActiveFilterFn}
        onResetActiveFilters={vi.fn()}
      />
    )

    // Multi-select filters are represented by the count chip inside the input,
    // so only non-multi-select active filters produce removable chips in the summary row.
    const activeFilterChip = screen.getAllByTestId('CancelIcon')[0]
    fireEvent.click(activeFilterChip)
    expect(onRemoveActiveFilterFn).toBeCalledWith('freetext', 'single-field', 'test-value')
  })

  it('should clear filters on remove filters button click', async () => {
    const onResetActiveFilters = vi.fn()
    const user = userEvent.setup()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={activeFiltersMocks}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={onResetActiveFilters}
      />
    )

    const clearFiltersButton = screen.getByRole('button', { name: 'Annulla filtri' })
    await user.click(clearFiltersButton)
    expect(onResetActiveFilters).toBeCalled()
  })
})
