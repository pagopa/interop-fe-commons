import React from 'react'
import { Stack } from '@mui/material'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import type {
  FilterOption,
  FilterHandler,
  FiltersHandlers,
  FilterFieldValue,
  FilterFieldsValues,
} from '../filters.types'
import { getFiltersFieldsInitialValues, getFiltersFieldsDefaultValue } from '../filters.utils'
import { useSearchParams } from 'react-router-dom'

export type FiltersProps = FiltersHandlers & {
  hasSubmitButton?: boolean
  rightContent?: React.ReactNode
}

/**
 * Takes the filters handlers returned from the useFilters hook and renders the filters fields and the active filters chips.
 */
export const Filters: React.FC<FiltersProps> = ({
  activeFilters,
  onChangeActiveFilter,
  onRemoveActiveFilter,
  onResetActiveFilters,
  onSetActiveFilters,
  fields,
  hasSubmitButton,
  rightContent,
}) => {
  const [searchParams] = useSearchParams()
  const [fieldsValues, setFieldsValues] = React.useState<FilterFieldsValues>(() =>
    getFiltersFieldsInitialValues(searchParams, fields, hasSubmitButton)
  )

  const handleFieldsValuesChange = React.useCallback((name: string, value: FilterFieldValue) => {
    setFieldsValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleRemoveActiveFilter: FilterHandler = (type, filterKey, value) => {
    if (type === 'autocomplete-multiple') {
      const fieldValue = fieldsValues[filterKey] as Array<FilterOption>
      handleFieldsValuesChange(
        filterKey,
        fieldValue.filter(({ value: v }) => v !== value)
      )
    } else {
      const defaultValues = getFiltersFieldsDefaultValue(fields, hasSubmitButton)
      handleFieldsValuesChange(filterKey, defaultValues[filterKey])
    }
    onRemoveActiveFilter(type, filterKey, value)
  }

  const handleResetActiveFilters = () => {
    setFieldsValues(getFiltersFieldsDefaultValue(fields, hasSubmitButton))
    onResetActiveFilters()
  }

  const onSubmit = () => {
    onSetActiveFilters(fields, fieldsValues)
  }

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
      <FiltersFields
        fields={fields}
        fieldsValues={fieldsValues}
        onFieldsValuesChange={handleFieldsValuesChange}
        onChangeActiveFilter={onChangeActiveFilter}
        onResetActiveFilters={handleResetActiveFilters}
        onSubmit={onSubmit}
        hasSubmitButton={hasSubmitButton}
      />
      <ActiveFilterChips
        activeFilters={activeFilters}
        onRemoveActiveFilter={handleRemoveActiveFilter}
        onResetActiveFilters={handleResetActiveFilters}
        hasSubmitButton={hasSubmitButton}
        rightContent={rightContent}
      />
    </Stack>
  )
}
