import React from 'react'
import type {
  AutocompleteFilterFieldOptions,
  FilterFieldCommonProps,
  FilterFieldsValues,
  FilterOption,
} from '../filters.types'
import { AutocompleteBaseFilterField } from './AutocompleteBaseFilterField'

export const AutocompleteMultipleFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
}) => {
  const field = _field as AutocompleteFilterFieldOptions
  const filterKey = field.name

  const debounceRef = React.useRef<NodeJS.Timeout>()

  const handleAutocompleteMultipleChange = (data: FilterFieldsValues['string']) => {
    onFieldsValuesChange(filterKey, data)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => onChangeActiveFilter('autocomplete-multiple', filterKey, data),
      300
    )
  }

  return (
    <AutocompleteBaseFilterField<true>
      multiple
      label={field.label}
      value={value as FilterOption[]}
      options={field.options}
      disableCloseOnSelect
      onInputChange={field?.onTextInputChange}
      onChange={(_, data) => {
        handleAutocompleteMultipleChange(data)
      }}
    />
  )
}
