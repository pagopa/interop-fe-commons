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
            onSetActiveFilters={vi.fn()}
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
            onSetActiveFilters={vi.fn()}
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
            onSetActiveFilters={vi.fn()}
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
            onSetActiveFilters={vi.fn()}
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
            onSetActiveFilters={vi.fn()}
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
        onSetActiveFilters={vi.fn()}
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
        onSetActiveFilters={vi.fn()}
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
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={onRemoveActiveFilterFn}
        onResetActiveFilters={vi.fn()}
      />
    )

    const activeFilterChip = screen.getAllByTestId('CancelIcon')[0]
    fireEvent.click(activeFilterChip)
    expect(onRemoveActiveFilterFn).toBeCalledWith(
      'autocomplete-multiple',
      'multiple-field',
      'option-1'
    )
  })

  it('should clear filters on remove filters button click', async () => {
    const onResetActiveFilters = vi.fn()
    const user = userEvent.setup()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={activeFiltersMocks}
        onSetActiveFilters={vi.fn()}
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

describe('Filters component with hasSubmitButton', () => {
  it('should render "Filtra" and "Annulla filtri" buttons', () => {
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
        hasSubmitButton
      />
    )

    expect(screen.getByRole('button', { name: 'Filtra' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annulla filtri' })).toBeInTheDocument()
  })

  it('should not render submit buttons when hasSubmitButton is not set', () => {
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: 'Filtra' })).not.toBeInTheDocument()
  })

  it('should not apply filters immediately when typing in a freetext field', async () => {
    const user = userEvent.setup()
    const onChangeActiveFilterFn = vi.fn()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
        hasSubmitButton
      />
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'test-value')
    expect(singleFilterField.value).toBe('test-value')
    expect(onChangeActiveFilterFn).not.toHaveBeenCalled()
  })

  it('should not apply filters on Enter key in a freetext field', async () => {
    const user = userEvent.setup()
    const onChangeActiveFilterFn = vi.fn()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
        hasSubmitButton
      />
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'test-value{enter}')
    expect(onChangeActiveFilterFn).not.toHaveBeenCalled()
  })

  it('should not render search icon in freetext fields', () => {
    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
        hasSubmitButton
      />
    )

    expect(screen.queryByLabelText('Filtra')).not.toBeInTheDocument()
  })

  it('should call onSetActiveFilters with all field values when clicking "Filtra"', async () => {
    const user = userEvent.setup()
    const onSetActiveFiltersFn = vi.fn()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={onSetActiveFiltersFn}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
        hasSubmitButton
      />
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'test-value')

    const submitButton = screen.getByRole('button', { name: 'Filtra' })
    await user.click(submitButton)

    expect(onSetActiveFiltersFn).toHaveBeenCalledWith(
      fieldMocks,
      expect.objectContaining({ 'single-field': 'test-value' })
    )
  })

  it('should reset fields and call onResetActiveFilters when clicking "Annulla filtri"', async () => {
    const user = userEvent.setup()
    const onResetActiveFiltersFn = vi.fn()

    const screen = renderWithRouter(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onSetActiveFilters={vi.fn()}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={onResetActiveFiltersFn}
        hasSubmitButton
      />
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'something')
    expect(singleFilterField.value).toBe('something')

    const cancelButton = screen.getByRole('button', { name: 'Annulla filtri' })
    await user.click(cancelButton)

    expect(onResetActiveFiltersFn).toHaveBeenCalled()
    expect(singleFilterField.value).toBe('')
  })
})
