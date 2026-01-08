import React from 'react'
import type {
  AutocompleteFilterFieldOptions,
  FilterFieldCommonProps,
  FilterFieldsValues,
  FilterOption,
} from '../filters.types'
import { AutocompleteBaseFilterField } from './AutocompleteBaseFilterField'

export const AutocompleteSingleFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
  hasSubmitButton,
}) => {
  const field = _field as AutocompleteFilterFieldOptions
  const filterKey = field.name

  const handleAutocompleteSingleChange = (data: FilterFieldsValues['string']) => {
    onFieldsValuesChange(filterKey, data)
    if (!hasSubmitButton) onChangeActiveFilter('autocomplete-single', filterKey, data)
  }

  return (
    <AutocompleteBaseFilterField<false>
      label={field.label}
      blurOnSelect
      value={value as FilterOption}
      options={field.options}
      onInputChange={field?.onTextInputChange}
      onChange={(_, data) => {
        handleAutocompleteSingleChange(data)
      }}
    />
  )
}
